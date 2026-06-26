// bot-tick — drives the themed AI bots across ALL active rooms. Called on a
// fast cron (and optionally when a human sends). Server-authoritative.
//
// Cost controls:
//  - AI only when a real user is present in that room (empty rooms = no calls)
//  - <= 2 bot messages per room per tick, and a global cap across rooms
//  - scripted one-liner fallback only if an AI call fails

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { nextSpeakAt, scriptedFallback } from '../_shared/botPersonalities.ts'
import { generateAiReply } from '../_shared/voidaiClient.ts'

const MAX_PER_ROOM_TICK = 2
const GLOBAL_CAP = 8

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
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, theme')
      .eq('is_active', true)
    if (!sessions || sessions.length === 0) return json({ ticked: true, rooms: 0 })

    const nowIso = new Date().toISOString()
    let totalPosted = 0
    let totalAi = 0

    for (const session of sessions) {
      if (totalAi >= GLOBAL_CAP) break

      // Only spend API on LIVE rooms: a real person joined or messaged in the
      // last 5 min. Abandoned rooms go quiet (frees the global cap; the cron
      // ends them at 11 min anyway).
      const fiveAgo = new Date(Date.now() - 5 * 60 * 1000)
      const { data: humans } = await supabase
        .from('participants')
        .select('id, joined_at')
        .eq('session_id', session.id)
        .eq('is_bot', false)
        .is('left_at', null)
      if (!humans || humans.length === 0) continue
      let live = humans.some((h) => new Date(h.joined_at) > fiveAgo)
      if (!live) {
        const { count: recentHuman } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('session_id', session.id)
          .in('participant_id', humans.map((h) => h.id))
          .gt('sent_at', fiveAgo.toISOString())
        live = (recentHuman ?? 0) > 0
      }
      if (!live) continue

      // Due bots, soonest first.
      const { data: due } = await supabase
        .from('participants')
        .select('id, display_name, bot_state')
        .eq('session_id', session.id)
        .eq('is_bot', true)
        .lte('bot_state->>next_speak_at', nowIso)
        .order('bot_state->>next_speak_at', { ascending: true })
        .limit(MAX_PER_ROOM_TICK)
      if (!due || due.length === 0) continue

      const { data: recentDesc } = await supabase
        .from('messages')
        .select('display_name, content')
        .eq('session_id', session.id)
        .order('sent_at', { ascending: false })
        .limit(12)
      const recent = (recentDesc ?? []).reverse()

      for (const bot of due) {
        if (totalAi >= GLOBAL_CAP) break
        let content: string
        try {
          content = await generateAiReply(bot.display_name, session.theme ?? 'just hanging out', recent)
          totalAi++
        } catch (_e) {
          content = scriptedFallback()
        }

        await supabase.from('messages').insert({
          session_id: session.id,
          participant_id: bot.id,
          display_name: bot.display_name,
          content,
          type: 'chat',
        })
        // feed our own line back into context for the next bot in this loop
        recent.push({ display_name: bot.display_name, content })

        await supabase
          .from('participants')
          .update({
            bot_state: {
              ...bot.bot_state,
              next_speak_at: nextSpeakAt(),
              messages_sent: (bot.bot_state?.messages_sent ?? 0) + 1,
            },
          })
          .eq('id', bot.id)
        totalPosted++
      }
    }

    return json({ ticked: true, rooms: sessions.length, posted: totalPosted, ai_calls: totalAi })
  } catch (err) {
    console.error('[bot-tick]', err)
    return json({ error: 'internal', detail: String(err) }, 500)
  }
})
