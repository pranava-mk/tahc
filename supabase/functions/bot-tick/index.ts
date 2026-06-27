// bot-tick — burst + drip engine. For each LIVE room it generates a short
// multi-bot exchange in ONE AI call (coherent, in-theme, reacting to the latest
// human message), then DRIPS the lines in 0.7–1.9s apart so the chat flows like
// a real group chat instead of synchronized pings.
//
// Cost / pacing controls:
//  - only rooms with a human active in the last 5 min
//  - skip if the room got a message in the last 6s (a burst likely just ran)
//  - at most a couple rooms per tick
//  - on AI failure: a couple natural fallback lines, deduped (rare)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { scriptedFallback } from '../_shared/botPersonalities.ts'
import { generateBurst } from '../_shared/voidaiClient.ts'

const MAX_BURST_ROOMS = 2
const BURST_COOLDOWN_MS = 6000

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  try {
    const { data: sessions } = await supabase
      .from('sessions').select('id, theme').eq('is_active', true)
    if (!sessions || sessions.length === 0) return json({ ticked: true, rooms: 0 })

    let bursts = 0
    let posted = 0

    for (const session of sessions) {
      if (bursts >= MAX_BURST_ROOMS) break

      // live = a real person joined or messaged in the last 5 min
      const fiveAgo = new Date(Date.now() - 5 * 60 * 1000)
      const { data: humans } = await supabase
        .from('participants').select('id, joined_at')
        .eq('session_id', session.id).eq('is_bot', false).is('left_at', null)
      if (!humans || humans.length === 0) continue
      let live = humans.some((h) => new Date(h.joined_at) > fiveAgo)
      if (!live) {
        const { count } = await supabase.from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('session_id', session.id).in('participant_id', humans.map((h) => h.id))
          .gt('sent_at', fiveAgo.toISOString())
        live = (count ?? 0) > 0
      }
      if (!live) continue

      // recent context (newest first → reverse to chronological)
      const { data: recentDesc } = await supabase
        .from('messages').select('display_name, content, sent_at')
        .eq('session_id', session.id).order('sent_at', { ascending: false }).limit(12)
      const recent = (recentDesc ?? []).reverse()

      // anti-overlap: don't start a burst if one just ran
      if (recent.length) {
        const ageMs = Date.now() - new Date(recent[recent.length - 1].sent_at).getTime()
        if (ageMs < BURST_COOLDOWN_MS) continue
      }

      // bots in this room
      const { data: bots } = await supabase
        .from('participants').select('id, display_name')
        .eq('session_id', session.id).eq('is_bot', true)
      if (!bots || bots.length === 0) continue
      const idByName = new Map(bots.map((b) => [b.display_name.toLowerCase(), b.id]))
      const botNames = bots.map((b) => b.display_name)

      // one AI call → an exchange; fallback to a couple natural lines
      let lines: { name: string; text: string }[]
      try {
        lines = await generateBurst(botNames, session.theme ?? 'just hanging out', recent.map((m) => ({ display_name: m.display_name, content: m.content })))
      } catch (_e) {
        const a = bots[Math.floor(Math.random() * bots.length)]
        const b = bots[Math.floor(Math.random() * bots.length)]
        lines = [{ name: a.display_name, text: scriptedFallback() }, { name: b.display_name, text: scriptedFallback() }]
          .filter((l, i, arr) => arr.findIndex((x) => x.text === l.text) === i)
      }
      bursts++

      // DRIP the lines in
      for (const line of lines) {
        const pid = idByName.get(line.name.toLowerCase()) ?? bots[Math.floor(Math.random() * bots.length)].id
        const name = bots.find((b) => b.id === pid)!.display_name
        await supabase.from('messages').insert({
          session_id: session.id, participant_id: pid, display_name: name, content: line.text, type: 'chat',
        })
        posted++
        await sleep(700 + Math.floor(Math.random() * 1200))
      }
    }

    return json({ ticked: true, rooms: sessions.length, bursts, posted })
  } catch (err) {
    console.error('[bot-tick]', err)
    return json({ error: 'internal', detail: String(err) }, 500)
  }
})
