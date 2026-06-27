import PropTypes from 'prop-types'

const NAME_COLORS = ['#3B5BFF', '#9D4EDD', '#1FA84F', '#F76808', '#0E7490', '#C026D3', '#B45309', '#1D4ED8']
function colorFor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return NAME_COLORS[h % NAME_COLORS.length]
}
function hhmm(d) { return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }

function renderText(text) {
  return text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith('@')
      ? <span key={i} className="bg-yellow border-2 border-ink rounded px-1 font-bold">{part}</span>
      : <span key={i}>{part}</span>,
  )
}

export default function Message({ message, isOwn = false }) {
  const { type, user, text, timestamp } = message
  const time = hhmm(timestamp)

  if (type === 'info' || type === 'warn') {
    return (
      <div className="flex justify-center px-4 my-1 animate-fade-in">
        <span className={`tag-brutal ${type === 'warn' ? 'bg-orange' : 'bg-cyan'} text-ink`}>{text}</span>
      </div>
    )
  }

  if (type === 'emote') {
    return (
      <div className="flex justify-center px-4 my-1 animate-pop-in">
        <span className="tag-brutal bg-lime italic">✺ {user} {text}</span>
      </div>
    )
  }

  return (
    <div className={`flex px-3 ${isOwn ? 'justify-end' : 'justify-start'} animate-pop-in`}>
      <div className={`max-w-[80%] border-3 border-ink rounded-brutal shadow-brutal-sm px-3 py-1.5
                       ${isOwn ? 'bg-pink' : 'bg-card'}`}>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-display font-bold text-xs" style={{ color: isOwn ? '#111' : colorFor(user) }}>
            {user}{isOwn && <span className="text-ink/50 font-medium"> · you</span>}
          </span>
          <span className="font-mono text-[10px] text-ink/40 tabular-nums">{time}</span>
        </div>
        <div className="font-mono text-sm text-ink break-words leading-snug">{renderText(text)}</div>
      </div>
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
