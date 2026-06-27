// Covert channel: bot names are EXACTLY 4 letters (even). Human names are ODD
// length (3, 5, ...). Same casual-handle style — only the letter count tells
// them apart. Count the letters: 4 = bot, odd = real person.

export const ODD = 1
export const EVEN = 0

// Exactly-4-letter handles for bots.
const FOUR = [
  'omar', 'zara', 'finn', 'theo', 'nina', 'lena', 'ravi', 'tina', 'asha', 'kira',
  'noah', 'milo', 'ezra', 'cole', 'jude', 'remy', 'rhea', 'anya', 'sara', 'beck',
  'kobe', 'alex', 'jess', 'nora', 'enzo', 'lola', 'yuki', 'demi', 'dani', 'levi',
  'otis', 'kian', 'raya', 'nico', 'maya', 'ivan', 'juno', 'bram',
]

// Odd-length handles for humans (3 / 5 / longer).
const ODD_POOL = [
  'sam', 'neo', 'kai', 'jay', 'rey', 'sid', 'vik', 'dan', 'leo', 'max',
  'dev', 'ria', 'ana', 'mia', 'jin', 'rob', 'tom', 'amy', 'eli',
  'rahul', 'kiran', 'arjun', 'priya', 'manny', 'devon', 'sasha', 'tariq',
  'omari', 'paolo', 'bobby', 'carla', 'diego', 'tessa', 'milan',
  'night_owl', 'lone_wolf', 'mr_blue',
]

function poolFor(parity) { return parity === EVEN ? FOUR : ODD_POOL }

export function generateName(parity, exclude = []) {
  const ex = new Set(exclude)
  const cands = poolFor(parity).filter((n) => !ex.has(n))
  const pool = cands.length ? cands : poolFor(parity)
  return pool[Math.floor(Math.random() * pool.length)]
}

// 6 distinct 4-letter names for the bots in a session.
export function pickBotNames(count = 6) {
  const names = []
  let guard = 0
  while (names.length < count && guard++ < 200) {
    const n = generateName(EVEN, names)
    if (n && !names.includes(n)) names.push(n)
  }
  return names
}
