// voidai AI driver for bot replies. OpenAI-compatible chat completions.
// Key comes ONLY from the VOIDAI_API_KEY function secret — never hardcoded.
// Throws on any failure (missing key, timeout, bad response) so the caller
// falls back to a free scripted line.

import type { BotPersonality } from './botPersonalities.ts'

const ENDPOINT = 'https://api.voidai.app/v1/chat/completions'
const MODEL = Deno.env.get('VOIDAI_MODEL') ?? 'gemini-2.5-flash'
const TIMEOUT_MS = 5000

interface RecentMessage {
  display_name: string
  content: string
}

export async function generateAiReply(
  bot: BotPersonality,
  displayName: string,
  topic: string,
  recent: RecentMessage[],
): Promise<string> {
  const apiKey = Deno.env.get('VOIDAI_API_KEY')
  if (!apiKey) throw new Error('VOIDAI_API_KEY not set')

  const transcript = recent.map((m) => `${m.display_name}: ${m.content}`).join('\n') || '(quiet so far)'
  const system =
    `You are "${displayName}", a regular person in an anonymous group chat with strangers. ` +
    `Your personality: ${bot.description} ` +
    `The room is loosely talking about: ${topic}. ` +
    `Write ONE short, casual chat message (max ~15 words). Lowercase is fine. ` +
    `React naturally to the recent messages or nudge the topic. No quotation marks, ` +
    `no hashtags, emoji only if it feels natural. Never say you are an AI or a bot.`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 60,
        temperature: 0.9,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `Recent chat:\n${transcript}\n\nYour message:` },
        ],
      }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`voidai ${res.status}`)
    const data = await res.json()
    let text: string = data?.choices?.[0]?.message?.content ?? ''
    text = text.trim().replace(/^["'`]+|["'`]+$/g, '').trim()
    if (!text) throw new Error('empty completion')
    // Keep it chat-sized.
    return text.length > 240 ? text.slice(0, 240) : text
  } finally {
    clearTimeout(timer)
  }
}
