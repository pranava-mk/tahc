import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

const MAX_LEN = 500

export default function ChatInput({ onSendMessage, placeholder = 'Type a message…', notice = '' }) {
  const [value, setValue] = useState('')
  const ref = useRef(null)

  const send = () => {
    if (value.trim()) {
      onSendMessage(value)
      setValue('')
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
    else if (e.key === 'Escape') { setValue(''); ref.current?.blur() }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, 160)}px`
    }
  }, [value])

  const near = value.length > MAX_LEN * 0.8

  return (
    <div className="border-t border-border bg-bg" id="footer">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={ref}
              value={value}
              maxLength={MAX_LEN}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              rows="1"
              id="chatinput"
              className="w-full resize-none bg-bg-elevated border border-border rounded-md
                         px-3 py-2.5 text-sm font-mono text-text placeholder:text-text-secondary/50
                         focus:outline-none focus:border-accent/50 transition-colors"
              style={{ minHeight: '44px', maxHeight: '160px' }}
            />
            {value.length > 0 && (
              <span className={`absolute bottom-2 right-3 text-[10px] tabular-nums ${near ? 'text-warning' : 'text-text-secondary/50'}`}>
                {value.length}/{MAX_LEN}
              </span>
            )}
          </div>
          <button
            onClick={send}
            disabled={!value.trim()}
            id="send-btn"
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-mono
                       border border-border text-text hover:border-accent hover:text-accent
                       disabled:opacity-30 disabled:hover:border-border disabled:hover:text-text
                       transition-colors active:scale-[0.98]"
          >
            <span>send</span>
            <PaperAirplaneIcon className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-text-secondary/50">
          <span>enter to send · shift+enter newline · <span className="text-text-secondary/70">/me</span> for an action</span>
          {notice && <span className="text-warning">{notice}</span>}
        </div>
      </div>
    </div>
  )
}

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  notice: PropTypes.string,
}
