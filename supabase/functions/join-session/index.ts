// join-session — find or create the active session, seed bots on creation,
// enforce the 7 real-user cap, issue an anon display name + client_token.
// No auth header required. Runs with the service role key (bypasses RLS).
//
// Response 200: { session_id, client_token, display_name, session_started_at, participant_id }
// Response 429: { error: 'room_full', retry_after_seconds }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { seedBotRows } from '../_shared/botPersonalities.ts'
import { generateDisplayName } from '../_shared/displayNames.ts'

const SESSION_LENGTH_SECONDS = 660 // 11 minutes
const MAX_REAL_USERS = 7

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    // 1. Find the active session, or create one (+ seed bots).
    let { data: session } = await supabase
      .from('sessions')
      .select('id, started_at')
      .eq('is_active', true)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!session) {
      const { data: created, error: createErr } = await supabase
        .from('sessions')
        .insert({})
        .select('id, started_at')
        .single()
      if (createErr) throw createErr
      session = created
      const { error: botErr } = await supabase.from('participants').insert(seedBotRows(session.id))
      if (botErr) throw botErr
    }

    // 2. Enforce the real-user cap.
    const { count } = await supabase
      .from('participants')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', session.id)
      .eq('is_bot', false)
      .is('left_at', null)

    if ((count ?? 0) >= MAX_REAL_USERS) {
      const elapsed = (Date.now() - new Date(session.started_at).getTime()) / 1000
      const remaining = Math.max(1, Math.ceil(SESSION_LENGTH_SECONDS - elapsed))
      return json({ error: 'room_full', retry_after_seconds: remaining }, 429)
    }

    // 3. Issue an anon identity and insert the participant.
    const display_name = generateDisplayName()
    const client_token = crypto.randomUUID()

    const { data: participant, error: pErr } = await supabase
      .from('participants')
      .insert({ session_id: session.id, display_name, is_bot: false, client_token })
      .select('id')
      .single()
    if (pErr) throw pErr

    return json({
      session_id: session.id,
      client_token,
      display_name,
      session_started_at: session.started_at,
      participant_id: participant.id,
    })
  } catch (err) {
    console.error('[join-session]', err)
    return json({ error: 'internal', detail: String(err) }, 500)
  }
})
