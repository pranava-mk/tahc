import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY
const SESSION_LENGTH = Number(import.meta.env.VITE_SESSION_SECONDS ?? '660')
const MAX_LEN = 500
// Generous — only blocks deliberate flooding, never normal fast chatting.
const BURST_MAX = 12
const BURST_WINDOW = 8000
const REPEAT_MAX = 4      // same exact message this many times in a row → block
const REPEAT_WINDOW = 5000

function mapMessage(row) {
  return {
    id: row.id,
    type: row.type || 'chat',
    user: row.display_name,
    text: row.content,
    timestamp: new Date(row.sent_at),
  }
}

// status: 'loading' | 'live' | 'room_full' | 'expired' | 'ended' | 'error'
export function useRoom(slug) {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [session, setSession] = useState(null)
  const [remaining, setRemaining] = useState(null)
  const [rotating, setRotating] = useState(false)
  const [notice, setNotice] = useState('')
  const [status, setStatus] = useState('loading')
  const [statusMeta, setStatusMeta] = useState(null)

  const sessionRef = useRef(null)
  const channelRef = useRef(null)
  const endedRef = useRef(false)
  const sendTimes = useRef([])
  const lastSent = useRef({ text: '', at: 0 })

  const cleanupChannel = useCallback(() => {
    if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await fetch(`${FUNCTIONS_URL}/join-session`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const s = await res.json()
      if (cancelled) return
      if (s.error) {
        if (s.error === 'room_full') { setStatus('room_full'); setStatusMeta(s.retry_after_seconds) }
        else if (s.error === 'slug_expired') { setStatus('expired'); setStatusMeta(s.unlock_in_minutes) }
        else setStatus('error')
        return
      }
      sessionRef.current = s
      setSession(s)
      setStatus('live')

      const { data: msgs } = await supabase
        .from('messages').select('id, display_name, content, type, sent_at')
        .eq('session_id', s.session_id).order('sent_at', { ascending: true })
      if (!cancelled) setMessages(msgs ? msgs.map(mapMessage) : [])

      const { data: parts } = await supabase
        .from('room_participants').select('display_name, joined_at')
        .eq('session_id', s.session_id).order('joined_at', { ascending: true })
      if (!cancelled) setUsers(parts ? parts.map((p, i) => ({ id: i, nickname: p.display_name })) : [])

      cleanupChannel()
      channelRef.current = supabase
        .channel(`room:${s.session_id}`)
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${s.session_id}` },
          (payload) => setMessages((prev) => prev.some((m) => m.id === payload.new.id) ? prev : [...prev, mapMessage(payload.new)]))
        .subscribe()

      // Pre-warm: kick the bots so the room is already mid-banter on entry.
      const prewarm = () => fetch(`${FUNCTIONS_URL}/bot-tick`, { method: 'POST', headers: { Authorization: `Bearer ${ANON}` } }).catch(() => {})
      setTimeout(() => { if (!cancelled) prewarm() }, 2500)
      setTimeout(() => { if (!cancelled) prewarm() }, 7000)

      // Reconcile messages posted during the brief subscription-setup gap.
      setTimeout(async () => {
        if (cancelled) return
        const { data: recent } = await supabase
          .from('messages').select('id, display_name, content, type, sent_at')
          .eq('session_id', s.session_id).order('sent_at', { ascending: true })
        if (recent) setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id))
          const add = recent.filter((r) => !ids.has(r.id)).map(mapMessage)
          return add.length ? [...prev, ...add].sort((a, b) => a.timestamp - b.timestamp) : prev
        })
      }, 1800)
    })()
    return () => { cancelled = true; cleanupChannel() }
  }, [slug, cleanupChannel])

  // Nudge the bots to react quickly to a human (debounced) so it feels live.
  const lastPoke = useRef(0)
  const pokeBots = useCallback(() => {
    const now = Date.now()
    if (now - lastPoke.current < 3000) return
    lastPoke.current = now
    fetch(`${FUNCTIONS_URL}/bot-tick`, { method: 'POST', headers: { Authorization: `Bearer ${ANON}` } }).catch(() => {})
  }, [])

  // Countdown → end. Slug expires, so we DON'T rejoin; we show the ended state.
  useEffect(() => {
    const startedAt = session?.session_started_at
    if (!startedAt) return
    const start = new Date(startedAt).getTime()
    const id = setInterval(async () => {
      const rem = Math.max(0, Math.ceil(SESSION_LENGTH - (Date.now() - start) / 1000))
      setRemaining(rem)
      if (rem <= 0 && !endedRef.current) {
        endedRef.current = true
        setRotating(true)
        clearInterval(id)
        try {
          await fetch(`${FUNCTIONS_URL}/end-session`, { method: 'POST', headers: { Authorization: `Bearer ${ANON}` } })
        } catch (e) { console.error('[useRoom] end-session failed:', e) }
        setTimeout(() => { setRotating(false); setStatus('ended') }, 3000)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [session])

  const flashNotice = useCallback((m) => { setNotice(m); setTimeout(() => setNotice(''), 1800) }, [])

  const handleSendMessage = useCallback(async (raw) => {
    const s = sessionRef.current
    let text = (raw ?? '').trim()
    if (!s || !text) return
    if (text.length > MAX_LEN) text = text.slice(0, MAX_LEN)
    let type = 'chat', content = text
    if (text.startsWith('/me ')) { type = 'emote'; content = text.slice(4).trim() }
    if (!content) return

    const now = Date.now()
    // Allow repeats (real chat repeats words) — only block the same exact line spammed.
    if (content === lastSent.current.text && now - lastSent.current.at < REPEAT_WINDOW) {
      lastSent.current.count = (lastSent.current.count || 1) + 1
      if (lastSent.current.count >= REPEAT_MAX) { flashNotice('ok we get it 😅'); return }
    } else {
      lastSent.current = { text: content, count: 1 }
    }
    lastSent.current.text = content
    lastSent.current.at = now
    // Generous flood guard.
    sendTimes.current = sendTimes.current.filter((t) => now - t < BURST_WINDOW)
    if (sendTimes.current.length >= BURST_MAX) { flashNotice('whoa, ease up a sec'); return }
    sendTimes.current.push(now)

    const { data, error } = await supabase.from('messages')
      .insert({ session_id: s.session_id, participant_id: s.participant_id, display_name: s.display_name, content, type })
      .select('id, display_name, content, type, sent_at').single()
    if (error) {
      console.error('[useRoom] send failed:', error)
      // Surface the failure instead of silently dropping it (the old bug).
      if (error.code === '42501') setStatus('ended')        // room no longer active
      else if (error.code === 'P0001' || /rate/i.test(error.message || '')) flashNotice('slow down — too many messages')
      else flashNotice("didn't send — try again")
      return
    }
    if (data) setMessages((prev) => prev.some((m) => m.id === data.id) ? prev : [...prev, mapMessage(data)])
    pokeBots() // let the bots react fast
  }, [flashNotice, pokeBots])

  const inviteUrl = session ? `${window.location.origin}/${session.slug ?? slug}` : ''

  return {
    messages, users,
    currentUser: { nickname: session?.display_name ?? '', id: session?.participant_id },
    remaining, rotating, notice, inviteUrl, status, statusMeta,
    handleSendMessage,
  }
}
