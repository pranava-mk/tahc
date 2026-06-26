import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

// Map a DB messages row → the shape the Message component expects.
function mapMessage(row) {
  return {
    id: row.id,
    type: row.type || 'chat',
    user: row.display_name,
    text: row.content,
    timestamp: new Date(row.sent_at),
  }
}

// Live room: joins via the join-session edge function, loads history + crowd,
// streams new messages over Realtime, and sends messages back. Returns the same
// shape the old useChat did, so the existing chat UI is a drop-in consumer.
export function useRoom() {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [session, setSession] = useState(null)
  const sessionRef = useRef(null)

  useEffect(() => {
    let channel
    let cancelled = false

    ;(async () => {
      // 1. Join (or rejoin) the active session.
      const res = await fetch(`${FUNCTIONS_URL}/join-session`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json' },
      })
      const s = await res.json()
      if (cancelled) return
      if (s.error) {
        console.error('[useRoom] join-session failed:', s)
        return
      }
      sessionStorage.setItem('tahc_session', JSON.stringify(s))
      sessionRef.current = s
      setSession(s)

      // 2. Load existing messages for this session.
      const { data: msgs } = await supabase
        .from('messages')
        .select('id, display_name, content, type, sent_at')
        .eq('session_id', s.session_id)
        .order('sent_at', { ascending: true })
      if (!cancelled && msgs) setMessages(msgs.map(mapMessage))

      // 3. Load the crowd from the sanitized view (no is_bot exposed).
      const { data: parts } = await supabase
        .from('room_participants')
        .select('display_name, joined_at')
        .eq('session_id', s.session_id)
        .order('joined_at', { ascending: true })
      if (!cancelled && parts) {
        setUsers(parts.map((p, i) => ({ id: i, nickname: p.display_name })))
      }

      // 4. Stream new messages in real time.
      channel = supabase
        .channel(`room:${s.session_id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${s.session_id}` },
          (payload) => {
            setMessages((prev) =>
              prev.some((m) => m.id === payload.new.id) ? prev : [...prev, mapMessage(payload.new)],
            )
          },
        )
        .subscribe()
    })()

    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  // Send a message. /me => emote (only command kept per PLAN); everything else is chat.
  const handleSendMessage = useCallback(async (text) => {
    const s = sessionRef.current
    const trimmed = text.trim()
    if (!s || !trimmed) return

    let type = 'chat'
    let content = trimmed
    if (trimmed.startsWith('/me ')) {
      type = 'emote'
      content = trimmed.slice(4).trim()
    }
    if (!content) return

    const { error } = await supabase.from('messages').insert({
      session_id: s.session_id,
      participant_id: s.participant_id,
      display_name: s.display_name,
      content,
      type,
    })
    if (error) console.error('[useRoom] send failed:', error)
    // No optimistic append: the Realtime INSERT echoes our own message back.
  }, [])

  const handleUserClick = useCallback(() => {}, [])
  const clearMessages = useCallback(() => {}, [])

  return {
    messages,
    users,
    currentUser: { nickname: session?.display_name ?? '', id: session?.participant_id },
    sessionStartedAt: session?.session_started_at ?? null,
    handleSendMessage,
    handleUserClick,
    clearMessages,
  }
}
