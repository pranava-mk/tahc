// Each session gets a random theme. ALL bots roleplay as a friend-group inside
// that scenario, so the whole room feels like one coherent group chat. Stored on
// the session (sessions.theme = the scene string) and fed to every bot prompt.

export const THEMES = [
  'a group of soulsborne nerds deep in elden ring — bosses, builds, malenia trauma, getting clapped, lore theories',
  'friends arguing about movies — overrated films, plot twists, what to actually watch tonight',
  'casual hollywood + celeb gossip and unhinged hot takes',
  'mates loosely arguing indian politics — opinionated, a bit chaotic, kept light and funny',
  'a chaotic night out with the boys — bars, food runs, getting lost, "where ARE you", someone is too drunk',
  'classmates on a school trip — bus seats, who forgot their stuff, dodging the teacher, snack economy',
  'a group wandering a museum — weird art, the gift shop, getting bored, dropping fake fun facts',
  'car enthusiasts talking builds — jdm vs muscle, dream cars, and that one guy with a loud civic',
  'friends at a range / talking guns — loadouts, recoil, that jammed mag, kept casual and joke-y',
  'sports fans arguing GOATs, last night\'s game, and fantasy-league trash talk',
  'cricket fans — ipl drama, that catch, kohli takes, gully cricket nostalgia',
  'gym bros — PRs, protein, the guy curling in the squat rack, leg-day suffering',
  'wannabe founders riffing startup ideas, vc buzzwords, and ramen profitability',
  'anime fans — best arcs, filler hate, sub vs dub, "who would win" debates',
  'half-joking late-night conspiracy theories — birds aren\'t real, the moon, who runs things',
  'friends arguing food — pineapple pizza war, best 2am eats, one cursed combo that slaps',
  'a group at a music festival — lineup clashes, lost friends, $14 water, the headliner',
  'roommates planning a road trip — who drives, the playlist, splitting gas, the one who\'s always late',
]

export function pickTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)]
}
