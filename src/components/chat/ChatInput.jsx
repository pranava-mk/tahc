import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

const MAX_LEN = 500

export default function ChatInput({ onSendMessage, placeholder = 'type something…', notice = '' }) {
  const [value, setValue] = useState('')
  const ref = useRef(null)

  const send = () => { if (value.trim()) { onSendMessage(value); setValue('') } }
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
    else if (e.key === 'Escape') { setValue(''); ref.current?.blur() }
  }
  useEffect(() => {
    if (ref.current) { ref.current.style.height = 'auto'; ref.current.style.height = `${Math.min(ref.current.scrollHeight, 140)}px` }
  }, [value])
  const near = value.length > MAX_LEN * 0.8

  return (
    <div className="shrink-0 border-t-3 border-ink bg-paper" id="footer">
      <div className="max-w-3xl mx-auto px-3 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={ref} value={value} maxLength={MAX_LEN} rows="1" id="chatinput"
              onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown} placeholder={placeholder}
              className="w-full resize-none bg-card border-3 border-ink rounded-brutal-sm shadow-brutal-sm
                         px-3 py-2.5 text-sm font-mono text-ink placeholder:text-muted/70
                         focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-brutal transition-all"
              style={{ minHeight: '46px', maxHeight: '140px' }}
            />
            {value.length > 0 && (
              <span className={`absolute bottom-2 right-2.5 font-mono text-[10px] font-bold tabular-nums ${near ? 'text-warning' : 'text-muted'}`}>
                {value.length}/{MAX_LEN}
              </span>
            )}
          </div>
          <button onClick={send} disabled={!value.trim()} id="send-btn"
            className="btn-brutal btn-blue h-[46px] px-4 disabled:opacity-40 disabled:shadow-brutal-sm disabled:translate-x-0 disabled:translate-y-0">
            <span className="hidden sm:inline">send</span>
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-muted">
          <span>enter ↵ send · shift+enter newline · <span className="text-ink font-bold">/me</span> action</span>
          {notice && <span className="tag-brutal bg-yellow py-0 animate-pop-in">{notice}</span>}
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
