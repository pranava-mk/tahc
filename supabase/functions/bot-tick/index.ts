// bot-tick — drives the bots. Called on a schedule (cron) and optionally when a
// human sends a message. Server-authoritative, idempotent per tick.
//
// Cost controls:
//  - only the 2 AI-typed bots ever call voidai; the other 4 are free scripted
//  - AI is skipped entirely when no real user is present (no burning credits on
//    empty / bot-only rooms)
//  - at most 1 AI call per tick; everything else is a free scripted line

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { personalityById, scriptedReply } from '../_shared/botPersonalities.ts'
import { generateAiReply } from '../_shared/voidaiClient.ts'

const MAX_AI_CALLS_PER_TICK = 1

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

function nextSpeakAt(min: number, max: number): string {
  const secs = min + Math.random() * (max - min)
  return new Date(Date.now() + secs * 1000).toISOString()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    const { data: session } = await supabase
      .from('sessions')
      .select('id, topic')
      .eq('is_active', true)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!session) return json({ ticked: false, reason: 'no_active_session' })

    const nowIso = new Date().toISOString()

    // Due bots for this session.
    const { data: dueBots } = await supabase
      .from('participants')
      .select('id, display_name, bot_state')
      .eq('session_id', session.id)
      .eq('is_bot', true)
      .lte('bot_state->>next_speak_at', nowIso)
    if (!dueBots || dueBots.length === 0) return json({ ticked: true, posted: 0 })

    // Is a real user present? Gates whether AI bots may call the API.
    const { count: realUsers } = await supabase
      .from('participants')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', session.id)
      .eq('is_bot', false)
      .is('left_at', null)
    const humansPresent = (realUsers ?? 0) > 0

    // Recent context for replies.
    const { data: recentDesc } = await supabase
      .from('messages')
      .select('display_name, content')
      .eq('session_id', session.id)
      .order('sent_at', { ascending: false })
      .limit(10)
    const recent = (recentDesc ?? []).reverse()

    let posted = 0
    let aiCalls = 0

    for (const bot of dueBots) {
      const pid = bot.bot_state?.personality_id
      const personality = pid ? personalityById(pid) : undefined
      if (!personality) continue

      let content: string
      if (personality.type === 'ai' && humansPresent && aiCalls < MAX_AI_CALLS_PER_TICK) {
        aiCalls++
        try {
          content = await generateAiReply(personality, bot.display_name, session.topic ?? 'random stuff', recent)
        } catch (_e) {
          content = scriptedReply(personality, recent) // free fallback
        }
      } else {
        content = scriptedReply(personality, recent)
      }

      await supabase.from('messages').insert({
        session_id: session.id,
        participant_id: bot.id,
        display_name: bot.display_name,
        content,
        type: 'chat',
      })

      const sent = (bot.bot_state?.messages_sent ?? 0) + 1
      await supabase
        .from('participants')
        .update({
          bot_state: {
            ...bot.bot_state,
            next_speak_at: nextSpeakAt(personality.cadence.minSeconds, personality.cadence.maxSeconds),
            messages_sent: sent,
          },
        })
        .eq('id', bot.id)

      posted++
    }

    return json({ ticked: true, posted, ai_calls: aiCalls, humans_present: humansPresent })
  } catch (err) {
    console.error('[bot-tick]', err)
    return json({ error: 'internal', detail: String(err) }, 500)
  }
})
