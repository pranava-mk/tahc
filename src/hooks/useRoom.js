import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY
// Overridable for testing rotation quickly; server enforces the real length.
const SESSION_LENGTH = Number(import.meta.env.VITE_SESSION_SECONDS ?? '660')

function mapMessage(row) {
  return {
    id: row.id,
    type: row.type || 'chat',
    user: row.display_name,
    text: row.content,
    timestamp: new Date(row.sent_at),
  }
}

// Live room with self-managed session lifecycle: joins the active session,
// streams messages, and when the shared countdown hits 0 it triggers
// server-authoritative rotation (end-session), shows a brief transition, then
// rejoins the fresh session. Same return shape the chat UI already consumes.
export function useRoom() {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [session, setSession] = useState(null)
  const [remaining, setRemaining] = useState(null)
  const [rotating, setRotating] = useState(false)

  const sessionRef = useRef(null)
  const channelRef = useRef(null)
  const rotatingRef = useRef(false)

  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  // Join (or rejoin) the active session: load history + crowd, subscribe realtime.
  const joinRoom = useCallback(async () => {
    const res = await fetch(`${FUNCTIONS_URL}/join-session`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json' },
    })
    const s = await res.json()
    if (s.error) {
      console.error('[useRoom] join-session failed:', s)
      return
    }
    sessionStorage.setItem('tahc_session', JSON.stringify(s))
    sessionRef.current = s
    setSession(s)

    const { data: msgs } = await supabase
      .from('messages')
      .select('id, display_name, content, type, sent_at')
      .eq('session_id', s.session_id)
      .order('sent_at', { ascending: true })
    setMessages(msgs ? msgs.map(mapMessage) : [])

    const { data: parts } = await supabase
      .from('room_participants')
      .select('display_name, joined_at')
      .eq('session_id', s.session_id)
      .order('joined_at', { ascending: true })
    setUsers(parts ? parts.map((p, i) => ({ id: i, nickname: p.display_name })) : [])

    cleanupChannel()
    channelRef.current = supabase
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
  }, [cleanupChannel])

  // Initial join.
  useEffect(() => {
    joinRoom()
    return cleanupChannel
  }, [joinRoom, cleanupChannel])

  // Countdown + rotation. One ticker per session.
  useEffect(() => {
    const startedAt = session?.session_started_at
    if (!startedAt) return
    const start = new Date(startedAt).getTime()

    const id = setInterval(async () => {
      const rem = Math.max(0, Math.ceil(SESSION_LENGTH - (Date.now() - start) / 1000))
      setRemaining(rem)

      if (rem <= 0 && !rotatingRef.current) {
        rotatingRef.current = true
        setRotating(true)
        clearInterval(id)
        // Ask the server to rotate (idempotent; safe if another client already did).
        try {
          await fetch(`${FUNCTIONS_URL}/end-session`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${ANON}` },
          })
        } catch (e) {
          console.error('[useRoom] end-session failed:', e)
        }
        // Brief transition, then drop into the fresh session.
        setTimeout(async () => {
          setMessages([])
          setUsers([])
          await joinRoom()
          setRotating(false)
          rotatingRef.current = false
        }, 3000)
      }
    }, 1000)

    return () => clearInterval(id)
  }, [session, joinRoom])

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

    const { data, error } = await supabase
      .from('messages')
      .insert({
        session_id: s.session_id,
        participant_id: s.participant_id,
        display_name: s.display_name,
        content,
        type,
      })
      .select('id, display_name, content, type, sent_at')
      .single()
    if (error) {
      console.error('[useRoom] send failed:', error)
      return
    }
    // Optimistic append so the sender sees it even before the Realtime echo
    // (or if the channel isn't fully subscribed yet). Echo is deduped by id.
    if (data) {
      setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, mapMessage(data)]))
    }
  }, [])

  const handleUserClick = useCallback(() => {}, [])
  const clearMessages = useCallback(() => {}, [])

  return {
    messages,
    users,
    currentUser: { nickname: session?.display_name ?? '', id: session?.participant_id },
    remaining,
    rotating,
    handleSendMessage,
    handleUserClick,
    clearMessages,
  }
}
