// Anonymous display-name generator: adjective_noun, lowercase.
// Used for real users on join. Bots use their own personality pools.

const ADJECTIVES = [
  'silent', 'dark', 'quiet', 'lone', 'hidden', 'faded', 'hollow', 'still',
  'soft', 'cold', 'pale', 'lost', 'wild', 'calm', 'dim', 'vast',
  'idle', 'blank', 'grey', 'numb', 'slow', 'odd', 'lush', 'raw',
  'sly', 'deep', 'thin', 'bare', 'mute', 'worn',
]

const NOUNS = [
  'moth', 'river', 'echo', 'fog', 'ember', 'static', 'drift', 'pulse',
  'crow', 'ash', 'tide', 'dusk', 'haze', 'spark', 'vapor', 'glitch',
  'wren', 'flux', 'shard', 'murmur', 'cinder', 'willow', 'frost', 'signal',
  'comet', 'lull', 'reef', 'thorn', 'verge', 'hush',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** e.g. "silent_moth". Caller should retry on collision within a session. */
export function generateDisplayName(): string {
  return `${pick(ADJECTIVES)}_${pick(NOUNS)}`
}
