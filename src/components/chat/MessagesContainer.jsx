import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'

export default function MessagesContainer({ messages, currentNick }) {
  const endRef = useRef(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <div className="flex-1 overflow-y-auto scroll-brutal" id="messages">
      <div className="max-w-3xl mx-auto py-5 space-y-2">
        {messages.length === 0 ? (
          <div className="flex justify-center px-4 py-10">
            <span className="tag-brutal bg-card animate-wobble">dropping you in…</span>
          </div>
        ) : (
          messages.map((m) => (
            <Message key={m.id} message={m} isOwn={!!currentNick && m.user === currentNick} />
          ))
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
