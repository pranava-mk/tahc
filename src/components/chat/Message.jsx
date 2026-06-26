import PropTypes from 'prop-types'
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { formatTimestamp } from '../../utils/messageParser'

export default function Message({ message }) {
  const { type, user, text, timestamp } = message

  const messageStyles = {
    chat: 'text-text',
    info: 'text-info',
    emote: 'text-accent',
    warn: 'text-warning',
    captcha: 'text-text-secondary font-mono text-xs',
  }

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <InformationCircleIcon className="w-4 h-4 flex-shrink-0" />
      case 'warn':
        return <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
      case 'emote':
        return <SparklesIcon className="w-4 h-4 flex-shrink-0" />
      default:
        return null
    }
  }

  // Parse text for mentions
  const renderText = (text) => {
    const parts = text.split(/(@\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="bg-accent-dim text-accent px-1.5 py-0.5 rounded-sm">
            {part}
          </span>
        )
      }
      return part
    })
  }

  // Detect code blocks
  const hasCodeBlock = text.includes('```')
  const codeBlockMatch = text.match(/```(\w+)?\n([\s\S]*?)```/)

  if (hasCodeBlock && codeBlockMatch) {
    const [, language, code] = codeBlockMatch
    const beforeCode = text.split('```')[0]

    return (
      <div className="py-4 px-6 hover:bg-bg-elevated/30 transition-quick animate-fade-in border-l-2 border-transparent hover:border-accent/20">
        {beforeCode && (
          <div className="mb-3">
            <span className="font-mono text-xs text-text-secondary">
              {formatTimestamp(timestamp)}
            </span>
            {user && (
              <span className="ml-3 font-medium text-sm text-text">
                {user}
              </span>
            )}
          </div>
        )}
        <pre className="bg-bg-elevated text-text p-5 rounded overflow-x-auto custom-scrollbar my-2 border border-border">
          <code className="text-xs font-mono leading-relaxed">
            {language && <span className="text-text-secondary">// {language}</span>}
            {'\n'}{code.trim()}
          </code>
        </pre>
      </div>
    )
  }

  // Regular message
  return (
    <div className={`
      py-4 px-6 hover:bg-bg-elevated/30
      transition-quick animate-fade-in
      border-l-2 border-transparent hover:border-accent/20
      ${messageStyles[type]}
    `}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-mono text-xs text-text-secondary">
              {formatTimestamp(timestamp)}
            </span>
            {user && type === 'chat' && (
              <span className="font-medium text-sm text-text">
                {user}
              </span>
            )}
            {user && type === 'emote' && (
              <span className="font-medium text-sm italic">
                {user}
              </span>
            )}
          </div>
          <div className={`text-sm leading-relaxed ${type === 'chat' ? '' : 'font-medium'}`}>
            {renderText(text)}
          </div>
        </div>
      </div>
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['chat', 'info', 'emote', 'warn', 'captcha']).isRequired,
    user: PropTypes.string,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
}
