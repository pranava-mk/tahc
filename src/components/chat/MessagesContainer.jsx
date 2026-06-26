import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'

export default function MessagesContainer({ messages, currentNick }) {
  const endRef = useRef(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-bg" id="messages">
      <div className="max-w-4xl mx-auto py-6">
        {messages.length === 0 ? (
          <div className="px-4 py-10 text-center text-text-secondary text-xs">
            <p className="opacity-70">connecting to the room…</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {messages.map((m) => (
              <Message key={m.id} message={m} isOwn={!!currentNick && m.user === currentNick} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}

MessagesContainer.propTypes = {
  messages: PropTypes.array.isRequired,
  currentNick: PropTypes.string,
}
