import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'

export default function MessagesContainer({ messages }) {
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto custom-scrollbar bg-bg"
      id="messages"
    >
      <div className="max-w-6xl mx-auto py-8">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <p className="text-sm">No messages yet. Start typing below.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

MessagesContainer.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
}
