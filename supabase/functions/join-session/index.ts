// join-session — join or create a slug-keyed ephemeral room.
//
//  /<slug>  : first visitor creates a themed room (11-min window); others with
//             the same slug join it. After it ends, the slug is locked for
//             SLUG_COOLDOWN_HOURS, then reusable as a fresh room.
//  Humans get an ODD-length display name (bots are EVEN) — covert channel.
//
// Public (--no-verify-jwt). Runs with the service role key (bypasses RLS).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { seedBotRows } from '../_shared/botPersonalities.ts'
import { generateName, ODD } from '../_shared/names.ts'
import { pickTheme } from '../_shared/themes.ts'

const SESSION_LENGTH_SECONDS = Number(Deno.env.get('SESSION_LENGTH_SECONDS') ?? '660')
const SLUG_COOLDOWN_HOURS = 11
const MAX_REAL_USERS = 7

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

function cleanSlug(s: unknown): string | null {
  if (typeof s !== 'string') return null
  const c = s.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 64)
  return c.length >= 2 ? c : null
}

async function createSession(supabase: any, slug: string | null) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ slug, theme: pickTheme() })
    .select('id, started_at')
    .single()
  if (error) throw error
  const { error: botErr } = await supabase.from('participants').insert(seedBotRows(data.id))
  if (botErr) throw botErr
  return data
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  try {
    let slug: string | null = null
    try {
      const body = await req.json()
      slug = cleanSlug(body?.slug)
    } catch { /* no body */ }

    let session: { id: string; started_at: string } | null = null

    if (slug) {
      const { data: rows } = await supabase
        .from('sessions')
        .select('id, started_at, is_active')
        .eq('slug', slug)
        .order('started_at', { ascending: false })
        .limit(1)
      const latest = rows?.[0]
      if (latest?.is_active) {
        session = { id: latest.id, started_at: latest.started_at }
      } else if (latest) {
        const ageHrs = (Date.now() - new Date(latest.started_at).getTime()) / 3_600_000
        if (ageHrs < SLUG_COOLDOWN_HOURS) {
          const unlockMins = Math.ceil((SLUG_COOLDOWN_HOURS - ageHrs) * 60)
          return json({ error: 'slug_expired', unlock_in_minutes: unlockMins }, 410)
        }
        session = await createSession(supabase, slug)
      } else {
        session = await createSession(supabase, slug)
      }
    } else {
      // No slug: fall back to a single shared active room (legacy).
      const { data: active } = await supabase
        .from('sessions')
        .select('id, started_at')
        .eq('is_active', true)
        .is('slug', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      session = active ?? (await createSession(supabase, null))
    }

    // Real-user cap.
    const { count } = await supabase
      .from('participants')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', session.id)
      .eq('is_bot', false)
      .is('left_at', null)
    if ((count ?? 0) >= MAX_REAL_USERS) {
      const elapsed = (Date.now() - new Date(session.started_at).getTime()) / 1000
      return json({ error: 'room_full', retry_after_seconds: Math.max(1, Math.ceil(SESSION_LENGTH_SECONDS - elapsed)) }, 429)
    }

    // Odd-length human name, distinct from everyone already in the room.
    const { data: existing } = await supabase
      .from('participants')
      .select('display_name')
      .eq('session_id', session.id)
    const taken = (existing ?? []).map((p: { display_name: string }) => p.display_name)
    const display_name = generateName(ODD, taken)
    const client_token = crypto.randomUUID()

    const { data: participant, error: pErr } = await supabase
      .from('participants')
      .insert({ session_id: session.id, display_name, is_bot: false, client_token })
      .select('id')
      .single()
    if (pErr) throw pErr

    return json({
      session_id: session.id,
      slug,
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
