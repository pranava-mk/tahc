// Covert channel: human display names are ODD length, bot names are EVEN length.
// Both draw from the SAME natural handle pool so style is never a tell — only
// the character count parity distinguishes them. (You can spot the humans by
// counting letters: odd = real.)

export const ODD = 1
export const EVEN = 0

const POOL = [
  // short
  'sam', 'neo', 'kai', 'jay', 'rey', 'sid', 'vik', 'dan', 'leo', 'max',
  'dev', 'ria', 'ana', 'mia', 'jin', 'rob', 'tom', 'amy', 'eli', 'ito',
  // 4 (even)
  'omar', 'zara', 'finn', 'theo', 'nina', 'lena', 'ravi', 'tina', 'asha', 'kira',
  'noah', 'milo', 'ezra', 'cole', 'jude', 'remy', 'rhea', 'anya', 'sara', 'beck',
  'kobe', 'alex', 'jess', 'nora', 'enzo', 'lola', 'yuki', 'demi',
  // 5 (odd)
  'rahul', 'kiran', 'arjun', 'priya', 'manny', 'devon', 'sasha', 'tariq', 'omari', 'paolo',
  'hiro_', 'zenya', 'bobby', 'carla', 'diego',
  // 6 (even)
  'aditya', 'sanjay', 'rohan_', 'farhan', 'tyrone', 'marcus', 'kelvin', 'naveen',
  // longer handles
  'night_owl', 'the_dude', 'lone_wolf', 'big_mike', 'dr_sus', 'lil_guy', 'mr_blue',
]

function len(n) { return n.length }

// Pick a random name of the wanted parity, not in `exclude`.
export function generateName(parity, exclude = []) {
  const ex = new Set(exclude)
  const cands = POOL.filter((n) => len(n) % 2 === parity && !ex.has(n))
  if (cands.length === 0) {
    // fallback: take any of right parity, append a digit if needed
    const base = POOL[Math.floor(Math.random() * POOL.length)]
    return len(base) % 2 === parity ? base : base + Math.floor(Math.random() * 10)
  }
  return cands[Math.floor(Math.random() * cands.length)]
}

// 6 distinct EVEN-length names for the bots in a session.
export function pickBotNames(count = 6) {
  const names = []
  let guard = 0
  while (names.length < count && guard++ < 200) {
    const n = generateName(EVEN, names)
    if (n && !names.includes(n)) names.push(n)
  }
  return names
}
