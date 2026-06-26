// Message parsing utilities for chat

export function parseCommand(text) {
  if (!text.startsWith('/')) return null

  const parts = text.slice(1).split(' ')
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)

  return { command, args, raw: text }
}

export function parseMarkdown(text) {
  // Simple markdown parsing for code blocks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const inlineCodeRegex = /`([^`]+)`/g

  let parsed = text

  // Parse code blocks
  parsed = parsed.replace(codeBlockRegex, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`
  })

  // Parse inline code
  parsed = parsed.replace(inlineCodeRegex, (match, code) => {
    return `<code class="inline-code">${escapeHtml(code)}</code>`
  })

  return parsed
}

export function parseMentions(text) {
  // Highlight @mentions
  const mentionRegex = /@(\w+)/g
  return text.replace(mentionRegex, '<span class="mention">@$1</span>')
}

export function parseLatex(text) {
  // Simple LaTeX detection (we'll use KaTeX for actual rendering)
  const latexRegex = /\$([^$]+)\$/g
  return text.match(latexRegex) !== null
}

export function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export function formatTimestamp(date) {
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 24) {
    return date.toLocaleDateString()
  } else if (hours > 0) {
    return `${hours}h ago`
  } else if (minutes > 0) {
    return `${minutes}m ago`
  } else {
    return 'just now'
  }
}
