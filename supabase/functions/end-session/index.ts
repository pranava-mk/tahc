// end-session — server-authoritative cleanup. Ends EVERY active room that has
// run its full length: archives the transcript, clears messages, retires
// participants, marks it inactive. Does NOT recreate — slug rooms are created
// when someone next visits the link. Idempotent; safe to call by anyone.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  try {
    const cutoff = new Date(Date.now() - SESSION_LENGTH_SECONDS * 1000).toISOString()
    const { data: expired } = await supabase
      .from('sessions')
      .select('id, started_at, slug, theme')
      .eq('is_active', true)
      .lt('started_at', cutoff)
    if (!expired || expired.length === 0) return json({ rotated: 0 })

    let rotated = 0
    for (const session of expired) {
      const startedMs = new Date(session.started_at).getTime()
      const { data: msgs } = await supabase
        .from('messages')
        .select('display_name, content, type, sent_at')
        .eq('session_id', session.id)
        .order('sent_at', { ascending: true })
      const { count: realUsers } = await supabase
        .from('participants').select('id', { count: 'exact', head: true })
        .eq('session_id', session.id).eq('is_bot', false)
      const { count: totalParts } = await supabase
        .from('participants').select('id', { count: 'exact', head: true })
        .eq('session_id', session.id)

      const endedAt = new Date()
      const archive = {
        session_id: session.id,
        slug: session.slug,
        theme: session.theme,
        started_at: session.started_at,
        ended_at: endedAt.toISOString(),
        duration_seconds: Math.round((endedAt.getTime() - startedMs) / 1000),
        real_user_count: realUsers ?? 0,
        total_participants: totalParts ?? 0,
        messages: (msgs ?? []).map((m) => ({
          t: Math.round((new Date(m.sent_at).getTime() - startedMs) / 1000),
          n: m.display_name, c: m.content, k: m.type,
        })),
      }

      await supabase.from('sessions')
        .update({ archive, ended_at: endedAt.toISOString(), is_active: false })
        .eq('id', session.id)
      await supabase.from('messages').delete().eq('session_id', session.id)
      await supabase.from('participants')
        .update({ left_at: endedAt.toISOString() })
        .eq('session_id', session.id).is('left_at', null)
      rotated++
    }

    return json({ rotated })
  } catch (err) {
    console.error('[end-session]', err)
    return json({ error: 'internal', detail: String(err) }, 500)
  }
})
