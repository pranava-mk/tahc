// Bots are now lightweight: an even-length handle + a speak schedule. Their
// persona comes entirely from the session theme + recent conversation at
// generation time (see voidaiClient). No hardcoded personalities.

import { pickBotNames } from './names.ts'

// Fast, group-chat cadence. First utterances staggered so they trickle in.
export const CADENCE = { minSeconds: 6, maxSeconds: 25 }
export const FIRST_SPEAK_MAX_MS = 20_000

// Generic, theme-agnostic lines used ONLY if the AI call fails.
const FALLBACK_LINES = [
  'wait what', 'lmao', 'fr', 'ok hear me out', 'nah', 'yeah no exactly',
  'hold on', 'who said that', 'real', 'i mean', 'stop 😭', 'ok but',
  'anyway', 'wait go back', 'bet', 'crazy', 'no shot', 'why is that so true',
]

export function scriptedFallback(): string {
  return FALLBACK_LINES[Math.floor(Math.random() * FALLBACK_LINES.length)]
}

export function nextSpeakAt(): string {
  const secs = CADENCE.minSeconds + Math.random() * (CADENCE.maxSeconds - CADENCE.minSeconds)
  return new Date(Date.now() + secs * 1000).toISOString()
}

// 6 bot participant rows for a fresh session. Even-length names (covert channel).
export function seedBotRows(sessionId: string) {
  return pickBotNames(6).map((name) => ({
    session_id: sessionId,
    display_name: name,
    is_bot: true,
    bot_type: 'ai',
    bot_state: {
      next_speak_at: new Date(Date.now() + Math.floor(Math.random() * FIRST_SPEAK_MAX_MS)).toISOString(),
      messages_sent: 0,
    },
  }))
}
