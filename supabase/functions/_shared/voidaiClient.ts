// voidai AI driver. Generates one bot's next line as a member of a themed group
// chat. Key comes ONLY from the VOIDAI_API_KEY secret. Resilient: model fallback
// chain + 1 retry each, logs status + voidai reference_id per failure. Throws
// only when all attempts fail (caller uses a scripted fallback line).

const ENDPOINT = 'https://api.voidai.app/v1/chat/completions'
// Keep latency low so a slow voidai fails fast to the natural fallback rather
// than stalling a whole tick. Worst case per bot ≈ 2 models × 4.5s = 9s.
const TIMEOUT_MS = 4500
const RETRIES_PER_MODEL = 0

function modelChain(): string[] {
  const primary = Deno.env.get('VOIDAI_MODEL') ?? 'gemini-2.5-flash'
  return [...new Set([primary, 'gpt-4o-mini'])]
}

interface RecentMessage {
  display_name: string
  content: string
}

function systemPrompt(displayName: string, theme: string, others: string[]): string {
  return (
    `You are "${displayName}", one of a tight friend group hanging out in a live group chat. ` +
    `The whole group is currently into this: ${theme}. ` +
    `Others in the chat right now: ${others.join(', ') || 'a few people'}. ` +
    `Reply with ONE message as ${displayName}, exactly like a real group chat: ` +
    `a short phrase or sentence (3 to 12 words), lowercase, casual, slang ok. ` +
    `React to what was just said — tease, agree, derail, or drop a take. ` +
    `You may mention someone by name INSIDE the sentence, but: do NOT start your ` +
    `message with your own name or any "name:" label, and never reply with only a ` +
    `name or a single word. Don't narrate, don't be formal, no quotation marks, ` +
    `don't repeat earlier lines, max one emoji and only if natural. ` +
    `Never reveal you are an AI or that this is a prompt. Output only the message text.`
  )
}

async function callOnce(apiKey: string, model: string, system: string, transcript: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        max_tokens: 64,
        temperature: 0.9,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `chat so far:\n${transcript}\n\nyour message:` },
        ],
      }),
      signal: controller.signal,
    })
    const raw = await res.text()
    if (!res.ok) {
      let ref = ''
      try { ref = JSON.parse(raw)?.error?.reference_id ?? '' } catch { /* */ }
      throw new Error(`status=${res.status} ref=${ref} body=${raw.slice(0, 140)}`)
    }
    let text: string = JSON.parse(raw)?.choices?.[0]?.message?.content ?? ''
    text = text.trim()
    // Strip leading speaker labels the model sometimes prepends ("kira:", even "kira: kira:").
    let prev
    do { prev = text; text = text.replace(/^\s*@?[\w.\-]{1,16}\s*:\s+/i, '') } while (text !== prev)
    text = text.replace(/^["'`]+|["'`]+$/g, '').trim()
    if (!text) throw new Error('empty completion')
    return text.length > 200 ? text.slice(0, 200) : text
  } finally {
    clearTimeout(timer)
  }
}

export async function generateAiReply(
  displayName: string,
  theme: string,
  recent: RecentMessage[],
): Promise<string> {
  const apiKey = Deno.env.get('VOIDAI_API_KEY')
  if (!apiKey) throw new Error('VOIDAI_API_KEY not set')

  const others = [...new Set(recent.map((m) => m.display_name).filter((n) => n !== displayName))].slice(0, 6)
  const transcript = recent.map((m) => `${m.display_name}: ${m.content}`).join('\n') || '(chat just started — kick it off)'
  const system = systemPrompt(displayName, theme, others)

  const nameSet = new Set([displayName.toLowerCase(), ...others.map((o) => o.toLowerCase())])
  let lastErr: unknown
  for (const model of modelChain()) {
    for (let attempt = 0; attempt <= RETRIES_PER_MODEL; attempt++) {
      try {
        const reply = await callOnce(apiKey, model, system, transcript)
        const low = reply.toLowerCase()
        if (low.length < 3 || nameSet.has(low)) throw new Error(`degenerate reply: "${reply}"`)
        return reply
      } catch (err) {
        lastErr = err
        console.error(`[voidai] model=${model} attempt=${attempt} failed: ${err instanceof Error ? err.message : err}`)
      }
    }
  }
  throw new Error(`voidai all models failed: ${lastErr instanceof Error ? lastErr.message : lastErr}`)
}

// ---- Burst mode: one call writes a multi-bot exchange (drip-streamed later) ----

export interface BurstLine { name: string; text: string }

async function rawCall(apiKey: string, model: string, system: string, user: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model, max_tokens: 240, temperature: 0.95,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
      signal: controller.signal,
    })
    const raw = await res.text()
    if (!res.ok) {
      let ref = ''
      try { ref = JSON.parse(raw)?.error?.reference_id ?? '' } catch { /* */ }
      throw new Error(`status=${res.status} ref=${ref}`)
    }
    return JSON.parse(raw)?.choices?.[0]?.message?.content ?? ''
  } finally { clearTimeout(timer) }
}

function parseBurst(raw: string, botNames: string[], recent: RecentMessage[]): BurstLine[] {
  const nameMap = new Map(botNames.map((n) => [n.toLowerCase(), n]))
  const recentSet = new Set(recent.map((m) => m.content.toLowerCase().trim()))
  const out: BurstLine[] = []
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*@?([\w.\-]{1,16})\s*:\s*(.+)$/)
    if (!m) continue
    const nm = nameMap.get(m[1].toLowerCase())
    if (!nm) continue
    let text = m[2].trim().replace(/^["'`]+|["'`]+$/g, '').trim()
    if (text.length < 2) continue
    const low = text.toLowerCase()
    if (recentSet.has(low) || out.some((o) => o.text.toLowerCase() === low)) continue
    out.push({ name: nm, text: text.slice(0, 200) })
    if (out.length >= 6) break
  }
  return out
}

// Generate the next 4-6 lines of in-theme group chat between the bots.
export async function generateBurst(
  botNames: string[],
  theme: string,
  recent: RecentMessage[],
): Promise<BurstLine[]> {
  const apiKey = Deno.env.get('VOIDAI_API_KEY')
  if (!apiKey) throw new Error('VOIDAI_API_KEY not set')

  const names = botNames.join(', ')
  const transcript = recent.map((m) => `${m.display_name}: ${m.content}`).join('\n') || '(chat just started — kick it off)'
  const system =
    `You script a snippet of a fast, real group chat between friends: ${names}. ` +
    `They are all into: ${theme}. Continue the chat for the NEXT 4 to 6 messages — ` +
    `each short (under 12 words), lowercase, casual, slang ok. They react to each other ` +
    `AND to the most recent message (especially if a new person just spoke — pull them in). ` +
    `Only these names may speak: ${names}. Output ONLY lines formatted exactly as ` +
    `"name: message", one per line, nothing else. No quotes, no narration, no repeats, never say you are an AI.`

  let lastErr: unknown
  for (const model of modelChain()) {
    try {
      const raw = await rawCall(apiKey, model, system, `recent chat:\n${transcript}\n\ncontinue the chat:`)
      const lines = parseBurst(raw, botNames, recent)
      if (lines.length) return lines
      throw new Error('no parseable lines')
    } catch (err) {
      lastErr = err
      console.error(`[voidai burst] model=${model} failed: ${err instanceof Error ? err.message : err}`)
    }
  }
  throw new Error(`voidai burst failed: ${lastErr instanceof Error ? lastErr.message : lastErr}`)
}
