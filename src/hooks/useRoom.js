import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY
const SESSION_LENGTH = Number(import.meta.env.VITE_SESSION_SECONDS ?? '660')
const MAX_LEN = 500

// Anti-spam: generous, only blocks deliberate flooding.
const BURST_MAX = 6        // messages
const BURST_WINDOW = 5000  // per 5s
const DUP_WINDOW = 3000    // identical message within 3s blocked

function mapMessage(row) {
  return {
    id: row.id,
    type: row.type || 'chat',
    user: row.display_name,
    text: row.content,
    timestamp: new Date(row.sent_at),
  }
}

export function useRoom() {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [session, setSession] = useState(null)
  const [remaining, setRemaining] = useState(null)
  const [rotating, setRotating] = useState(false)
  const [notice, setNotice] = useState('') // transient anti-spam feedback

  const sessionRef = useRef(null)
  const channelRef = useRef(null)
  const rotatingRef = useRef(false)
  const sendTimes = useRef([])
  const lastSent = useRef({ text: '', at: 0 })
  // requested session from an invite link (?s=...), used only on first join
  const invitedRef = useRef(new URLSearchParams(window.location.search).get('s'))

  const cleanupChannel = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  const joinRoom = useCallback(async () => {
    const res = await fetch(`${FUNCTIONS_URL}/join-session`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: invitedRef.current || undefined }),
    })
    const s = await res.json()
    invitedRef.current = null // only honor the invite on the first join
    if (s.error) {
      console.error('[useRoom] join-session failed:', s)
      setNotice(s.error === 'room_full' ? 'Room is full — try again shortly.' : 'Could not join.')
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

  useEffect(() => {
    joinRoom()
    return cleanupChannel
  }, [joinRoom, cleanupChannel])

  // Countdown + rotation.
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
        try {
          await fetch(`${FUNCTIONS_URL}/end-session`, { method: 'POST', headers: { Authorization: `Bearer ${ANON}` } })
        } catch (e) {
          console.error('[useRoom] end-session failed:', e)
        }
        setTimeout(async () => {
          setMessages([]); setUsers([])
          await joinRoom()
          setRotating(false); rotatingRef.current = false
        }, 3000)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [session, joinRoom])

  const flashNotice = useCallback((msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 1800)
  }, [])

  const handleSendMessage = useCallback(async (raw) => {
    const s = sessionRef.current
    let text = (raw ?? '').trim()
    if (!s || !text) return
    if (text.length > MAX_LEN) text = text.slice(0, MAX_LEN)

    let type = 'chat'
    let content = text
    if (text.startsWith('/me ')) { type = 'emote'; content = text.slice(4).trim() }
    if (!content) return

    const now = Date.now()
    // dedupe identical back-to-back
    if (content === lastSent.current.text && now - lastSent.current.at < DUP_WINDOW) {
      flashNotice('Easy — you just sent that.')
      return
    }
    // burst limit (sliding window)
    sendTimes.current = sendTimes.current.filter((t) => now - t < BURST_WINDOW)
    if (sendTimes.current.length >= BURST_MAX) {
      flashNotice('Slow down a sec.')
      return
    }
    sendTimes.current.push(now)
    lastSent.current = { text: content, at: now }

    const { data, error } = await supabase
      .from('messages')
      .insert({ session_id: s.session_id, participant_id: s.participant_id, display_name: s.display_name, content, type })
      .select('id, display_name, content, type, sent_at')
      .single()
    if (error) { console.error('[useRoom] send failed:', error); return }
    if (data) setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, mapMessage(data)]))
  }, [flashNotice])

  const inviteUrl = session
    ? `${window.location.origin}/chat?s=${session.session_id}`
    : ''

  return {
    messages,
    users,
    currentUser: { nickname: session?.display_name ?? '', id: session?.participant_id },
    remaining,
    rotating,
    notice,
    inviteUrl,
    handleSendMessage,
  }
}
