import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

export default function ChatInput({ onSendMessage, placeholder = 'Type a message...' }) {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    } else if (e.key === 'Escape') {
      setInputValue('')
      textareaRef.current?.blur()
    }
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputValue])

  const isCommand = inputValue.startsWith('/')

  return (
    <div
      className="border-t border-border bg-bg-elevated"
      id="footer"
    >
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-end gap-4">
          <div className="flex-1 relative">
            {isCommand && (
              <div className="absolute -top-32 left-0 right-0 bg-bg-elevated border border-border rounded p-4 animate-slide-up">
                <p className="text-xs font-mono text-text-secondary mb-3">
                  Available commands
                </p>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="text-info">/help - Show this help</div>
                  <div className="text-info">/nick [name] - Change nickname</div>
                  <div className="text-info">/whisper @user [msg] - Private message</div>
                  <div className="text-info">/me [action] - Send emote</div>
                  <div className="text-info">/clear - Clear messages</div>
                </div>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="input-text resize-none"
              rows="1"
              style={{ maxHeight: '200px', minHeight: '52px' }}
              id="chatinput"
            />
            {inputValue.length > 0 && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="text-xs font-mono text-text-secondary">
                  {inputValue.length}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="
              btn btn-primary
              flex items-center gap-2
              disabled:opacity-30
            "
          >
            <span>Send</span>
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 text-xs text-text-secondary font-mono">
          <kbd className="px-2 py-1 bg-bg-elevated rounded text-xs border border-border">Enter</kbd>
          <span className="mx-2">to send</span>
          <kbd className="px-2 py-1 bg-bg-elevated rounded text-xs border border-border">Shift+Enter</kbd>
          <span className="mx-2">for new line</span>
        </div>
      </div>
    </div>
  )
}

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
}
