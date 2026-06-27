// Bots are now lightweight: an even-length handle + a speak schedule. Their
// persona comes entirely from the session theme + recent conversation at
// generation time (see voidaiClient). No hardcoded personalities.

import { pickBotNames } from './names.ts'

// Fast, group-chat cadence.
export const CADENCE = { minSeconds: 5, maxSeconds: 18 }

// Natural reactions used ONLY if an AI call fails. Engaged enough to not break
// immersion in any theme (true theme content needs the model, which just failed).
const FALLBACK_LINES = [
  'ok that\'s actually a fair point', 'wait say that again', 'nah i\'m dead 😭',
  'lowkey true', 'ok but hear me out', 'who\'s gonna tell him', 'real talk',
  'that\'s crazy lol', 'bro 💀', 'ok ok keep going', 'yeah no exactly',
  'hold on hold on', 'i\'m not even surprised', 'this is sending me', 'be so fr rn',
  'ok that tracks', 'wait i missed it, what', 'nah that\'s wild', 'say less',
]

export function scriptedFallback(_theme?: string): string {
  return FALLBACK_LINES[Math.floor(Math.random() * FALLBACK_LINES.length)]
}

export function nextSpeakAt(): string {
  const secs = CADENCE.minSeconds + Math.random() * (CADENCE.maxSeconds - CADENCE.minSeconds)
  return new Date(Date.now() + secs * 1000).toISOString()
}

// 6 bot participant rows for a fresh session. Even-length names (covert channel).
// First few bots are due almost immediately so a kickoff tick pre-warms the room
// with banter before the human even types; the rest trickle in.
export function seedBotRows(sessionId: string) {
  return pickBotNames(6).map((name, i) => {
    const delayMs = i < 3 ? Math.floor(Math.random() * 3000) : 4000 + Math.floor(Math.random() * 10000)
    return {
      session_id: sessionId,
      display_name: name,
      is_bot: true,
      bot_type: 'ai',
      bot_state: {
        next_speak_at: new Date(Date.now() + delayMs).toISOString(),
        messages_sent: 0,
      },
    }
  })
}
