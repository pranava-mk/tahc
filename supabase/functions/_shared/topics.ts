// Each session gets a random casual topic. AI bots steer the room toward it so
// the conversation feels organic (never announced in the UI — part of the
// "random stranger chat" illusion).
export const TOPICS = [
  'is cereal a soup',
  'the worst movie everyone pretends is good',
  'best food to eat at 2am',
  'would you rather fight 100 duck-sized horses or one horse-sized duck',
  'songs that go unreasonably hard',
  'the most overrated tourist trap',
  'what useless skill are you weirdly good at',
  'pineapple on pizza, settle it',
  'the last thing that genuinely creeped you out',
  'underrated video games nobody talks about',
  'what conspiracy theory is lowkey believable',
  'best comfort show to rewatch',
  'weirdest thing you believed as a kid',
  'coffee vs tea, defend your side',
  'what would your villain origin story be',
  'the most useless superpower you can imagine',
  'animals that seem fake but are real',
  'what app do you check first in the morning',
  'the hill you will die on (food edition)',
  'best smell in the world',
  'which fictional world would you actually live in',
  'the most cursed food combination that slaps',
  'what sound is universally satisfying',
  'a trend you never understood',
  'if you could instantly master one instrument',
  'the most chaotic thing in your search history (sfw)',
  'what would you do with an extra hour every day',
  'best late-night drive music',
  'the most overhyped restaurant',
  'what small thing ruins your whole day',
]

export function pickTopic(): string {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)]
}
