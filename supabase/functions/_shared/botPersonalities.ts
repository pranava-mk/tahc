// 6 bot personalities. Scripted bots fire from idlePool / triggerKeywords.
// AI bots (echo, static) call voidai.app at runtime, falling back to idlePool.
// bot_type stored on the participant row; full personality looked up here by id.

export interface BotPersonality {
  id: string
  displayNamePool: string[]                  // random pick per session
  description: string                        // system prompt for AI driver
  type: 'scripted' | 'ai'
  cadence: { minSeconds: number; maxSeconds: number }
  triggerKeywords: Record<string, string[]>  // keyword -> candidate replies
  idlePool: string[]                         // fired when no keyword matches
}

export const BOT_PERSONALITIES: BotPersonality[] = [
  {
    id: 'nova',
    displayNamePool: ['nova', 'n0va', 'nov4'],
    description: 'Curious and tech-adjacent. Asks short questions, keeps energy up.',
    type: 'scripted',
    cadence: { minSeconds: 20, maxSeconds: 55 },
    triggerKeywords: {
      music: ['what are you listening to?', 'drop the playlist'],
      code: ['what stack?', 'ship it yet?'],
      game: ['what are you playing rn'],
    },
    idlePool: ['anyone up to anything?', 'slow night huh', 'wait what did i miss', 'ok but actually'],
  },
  {
    id: 'ash',
    displayNamePool: ['ash', 'a5h', 'a_sh'],
    description: 'Chill lurker. Minimal, dry responses. Rarely starts threads.',
    type: 'scripted',
    cadence: { minSeconds: 35, maxSeconds: 90 },
    triggerKeywords: {
      lol: ['lol', 'heh'],
      bye: ['cya', 'later'],
    },
    idlePool: ['mm', 'real', 'fair', '...', 'yeah'],
  },
  {
    id: 'river',
    displayNamePool: ['river', 'r1ver'],
    description: 'Philosophical, slightly dramatic. Reflects on small things.',
    type: 'scripted',
    cadence: { minSeconds: 25, maxSeconds: 70 },
    triggerKeywords: {
      time: ['time is so strange here', 'we never really arrive anywhere'],
      night: ['the night makes people honest'],
    },
    idlePool: ['do you ever just sit with a thought', 'feels like everyone is somewhere else', 'i was thinking about that earlier'],
  },
  {
    id: 'pixel',
    displayNamePool: ['pixel', 'p1xel', 'px'],
    description: 'Enthusiastic, internet-native slang. High energy, quick replies.',
    type: 'scripted',
    cadence: { minSeconds: 15, maxSeconds: 45 },
    triggerKeywords: {
      lol: ['LMAOO', 'pixel cackling rn'],
      cool: ['YESS', 'okok thats fire'],
    },
    idlePool: ['yo', 'wait this chat is kinda goated', 'brb getting snacks', 'who else is here fr'],
  },
  {
    id: 'echo',
    displayNamePool: ['echo', '3cho'],
    description: 'Riffs on and reflects whatever others just said. Conversational mirror.',
    type: 'ai',
    cadence: { minSeconds: 20, maxSeconds: 60 },
    triggerKeywords: {},
    idlePool: ['say more', 'that tracks', 'kind of what i was thinking'],
  },
  {
    id: 'static',
    displayNamePool: ['static', 'st4tic'],
    description: 'Cryptic, short, unpredictable. Drops odd one-liners.',
    type: 'ai',
    cadence: { minSeconds: 40, maxSeconds: 120 },
    triggerKeywords: {},
    idlePool: ['signal weak tonight', 'someone left the door open', 'not all of us are real', '— —'],
  },
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Free scripted reply: keyword-match recent text, else a random idle line. */
export function scriptedReply(
  p: BotPersonality,
  recent: Array<{ content: string }>,
): string {
  const haystack = recent.map((m) => m.content.toLowerCase()).join(' ')
  for (const [keyword, replies] of Object.entries(p.triggerKeywords)) {
    if (haystack.includes(keyword.toLowerCase()) && replies.length) {
      return pick(replies)
    }
  }
  return pick(p.idlePool)
}

/** Look up a personality by its id (stored in participants.bot_state). */
export function personalityById(id: string): BotPersonality | undefined {
  return BOT_PERSONALITIES.find((p) => p.id === id)
}

/** Build the 6 participant rows to seed into a fresh session. */
export function seedBotRows(sessionId: string) {
  return BOT_PERSONALITIES.map((p) => ({
    session_id: sessionId,
    display_name: pick(p.displayNamePool),
    is_bot: true,
    bot_type: p.type,
    bot_state: {
      personality_id: p.id,
      // first utterance staggered 0–90s after session start → organic arrival
      next_speak_at: new Date(Date.now() + Math.floor(Math.random() * 90_000)).toISOString(),
      messages_sent: 0,
    },
  }))
}
