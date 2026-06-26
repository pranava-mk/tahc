// end-session — server-authoritative session rotation.
// Idempotent + safe to call by anyone (anon): it only acts when the active
// session has actually run its full length. On rotation it archives the
// transcript, clears messages, ends the session, and starts a fresh one
// (with 6 new bots). Clients call this when their local countdown hits 0.
//
// Response: { rotated: true, new_session_id } | { rotated: false, reason|remaining }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { seedBotRows } from '../_shared/botPersonalities.ts'

const SESSION_LENGTH_SECONDS = Number(Deno.env.get('SESSION_LENGTH_SECONDS') ?? '660')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    const { data: session } = await supabase
      .from('sessions')
      .select('id, started_at')
      .eq('is_active', true)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!session) return json({ rotated: false, reason: 'no_active_session' })

    const startedMs = new Date(session.started_at).getTime()
    const elapsed = (Date.now() - startedMs) / 1000
    if (elapsed < SESSION_LENGTH_SECONDS) {
      return json({ rotated: false, remaining: Math.ceil(SESSION_LENGTH_SECONDS - elapsed) })
    }

    // Build the compressed archive (t = seconds since start).
    const { data: msgs } = await supabase
      .from('messages')
      .select('display_name, content, type, sent_at')
      .eq('session_id', session.id)
      .order('sent_at', { ascending: true })

    const { count: realUsers } = await supabase
      .from('participants')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', session.id)
      .eq('is_bot', false)

    const { count: totalParts } = await supabase
      .from('participants')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', session.id)

    const endedAt = new Date()
    const archive = {
      session_id: session.id,
      started_at: session.started_at,
      ended_at: endedAt.toISOString(),
      duration_seconds: Math.round((endedAt.getTime() - startedMs) / 1000),
      real_user_count: realUsers ?? 0,
      total_participants: totalParts ?? 0,
      messages: (msgs ?? []).map((m) => ({
        t: Math.round((new Date(m.sent_at).getTime() - startedMs) / 1000),
        n: m.display_name,
        c: m.content,
        k: m.type,
      })),
    }

    // Archive + end the session, then drop its live messages.
    await supabase
      .from('sessions')
      .update({ archive, ended_at: endedAt.toISOString(), is_active: false })
      .eq('id', session.id)
    await supabase.from('messages').delete().eq('session_id', session.id)
    // Retire the old session's participants so they don't linger in the view.
    await supabase
      .from('participants')
      .update({ left_at: endedAt.toISOString() })
      .eq('session_id', session.id)
      .is('left_at', null)

    // Start a fresh session immediately (zero downtime) with new bots.
    const { data: next, error: nextErr } = await supabase
      .from('sessions')
      .insert({})
      .select('id')
      .single()
    if (nextErr) throw nextErr
    await supabase.from('participants').insert(seedBotRows(next.id))

    return json({ rotated: true, new_session_id: next.id, archived_messages: archive.messages.length })
  } catch (err) {
    console.error('[end-session]', err)
    return json({ error: 'internal', detail: String(err) }, 500)
  }
})
