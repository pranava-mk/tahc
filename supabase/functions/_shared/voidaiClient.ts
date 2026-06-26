// voidai AI driver for bot replies. OpenAI-compatible chat completions.
// Key comes ONLY from the VOIDAI_API_KEY function secret — never hardcoded.
//
// Resilience: tries a chain of models, with 1 retry each on 5xx/network/timeout.
// Every failure is logged with status + voidai reference_id so the exact
// server-side error shows up in `supabase functions logs bot-tick`. Throws only
// when ALL attempts fail, so the caller falls back to a free scripted line.

import type { BotPersonality } from './botPersonalities.ts'

const ENDPOINT = 'https://api.voidai.app/v1/chat/completions'
const TIMEOUT_MS = 6000
const RETRIES_PER_MODEL = 1

// Primary from env, then fallbacks. Deduped, all free-plan eligible chat models.
function modelChain(): string[] {
  const primary = Deno.env.get('VOIDAI_MODEL') ?? 'gemini-2.5-flash'
  return [...new Set([primary, 'gpt-4o-mini', 'deepseek-v3'])]
}

interface RecentMessage {
  display_name: string
  content: string
}

function buildBody(model: string, system: string, transcript: string) {
  return JSON.stringify({
    model,
    max_tokens: 60,
    temperature: 0.9,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: `Recent chat:\n${transcript}\n\nYour message:` },
    ],
  })
}

async function callOnce(apiKey: string, body: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body,
      signal: controller.signal,
    })
    const raw = await res.text()
    if (!res.ok) {
      let ref = ''
      try { ref = JSON.parse(raw)?.error?.reference_id ?? '' } catch { /* non-json */ }
      throw new Error(`status=${res.status} ref=${ref} body=${raw.slice(0, 160)}`)
    }
    const data = JSON.parse(raw)
    let text: string = data?.choices?.[0]?.message?.content ?? ''
    text = text.trim().replace(/^["'`]+|["'`]+$/g, '').trim()
    if (!text) throw new Error('empty completion')
    return text.length > 240 ? text.slice(0, 240) : text
  } finally {
    clearTimeout(timer)
  }
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

  let lastErr: unknown
  for (const model of modelChain()) {
    const body = buildBody(model, system, transcript)
    for (let attempt = 0; attempt <= RETRIES_PER_MODEL; attempt++) {
      try {
        return await callOnce(apiKey, body)
      } catch (err) {
        lastErr = err
        console.error(`[voidai] model=${model} attempt=${attempt} failed: ${err instanceof Error ? err.message : err}`)
      }
    }
  }
  throw new Error(`voidai all models failed: ${lastErr instanceof Error ? lastErr.message : lastErr}`)
}
