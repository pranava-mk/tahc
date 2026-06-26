import PropTypes from 'prop-types'

// Stable muted color per name so users are visually distinguishable (IRC-style).
const NAME_COLORS = ['#E5C07B', '#56B6C2', '#98C379', '#C678DD', '#61AFEF', '#E06C75', '#D19A66', '#7FB3D5']
function colorFor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return NAME_COLORS[h % NAME_COLORS.length]
}

function hhmm(d) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function renderText(text) {
  return text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith('@')
      ? <span key={i} className="text-accent bg-accent-dim px-1 rounded-sm">{part}</span>
      : <span key={i}>{part}</span>,
  )
}

export default function Message({ message, isOwn = false }) {
  const { type, user, text, timestamp } = message
  const time = hhmm(timestamp)

  // System lines (info/warn): centered, muted.
  if (type === 'info' || type === 'warn') {
    return (
      <div className={`px-4 py-1 text-center text-xs ${type === 'warn' ? 'text-warning' : 'text-text-secondary'}`}>
        — {text} —
      </div>
    )
  }

  // Emote: "* name action", italic accent.
  if (type === 'emote') {
    return (
      <div className="group px-4 py-0.5 leading-relaxed hover:bg-bg-elevated/40">
        <span className="text-text-secondary/50 text-xs mr-2 tabular-nums">{time}</span>
        <span className="text-accent italic text-sm">* {user} {text}</span>
      </div>
    )
  }

  // Chat line: [hh:mm] name  text
  return (
    <div className={`group px-4 py-0.5 leading-relaxed hover:bg-bg-elevated/40 ${isOwn ? 'bg-accent-dim/30' : ''}`}>
      <span className="text-text-secondary/40 text-xs mr-2 tabular-nums select-none">{time}</span>
      <span
        className="text-sm font-semibold mr-2"
        style={{ color: isOwn ? '#FF3B30' : colorFor(user) }}
      >
        {user}
        {isOwn && <span className="text-text-secondary/50 font-normal"> (you)</span>}
      </span>
      <span className="text-sm text-text break-words">{renderText(text)}</span>
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['chat', 'info', 'emote', 'warn', 'captcha']).isRequired,
    user: PropTypes.string,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  isOwn: PropTypes.bool,
}
