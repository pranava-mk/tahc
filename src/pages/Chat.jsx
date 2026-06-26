import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, UsersIcon, LinkIcon, CheckIcon } from '@heroicons/react/24/outline'
import MessagesContainer from '../components/chat/MessagesContainer'
import ChatInput from '../components/chat/ChatInput'
import OnlinePanel from '../components/chat/OnlinePanel'
import SessionEndOverlay from '../components/chat/SessionEndOverlay'
import { useRoom } from '../hooks/useRoom'

function fmt(s) {
  if (s == null) return '--:--'
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

export default function Chat() {
  const { messages, users, currentUser, remaining, rotating, notice, inviteUrl, handleSendMessage } = useRoom()
  const [panelOpen, setPanelOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const low = remaining != null && remaining <= 60

  const copyInvite = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
    } catch {
      // fallback for non-secure contexts
      const ta = document.createElement('textarea')
      ta.value = inviteUrl; document.body.appendChild(ta); ta.select()
      document.execCommand('copy'); ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden font-mono">
      {rotating && <SessionEndOverlay />}

      {/* Header */}
      <header className="shrink-0 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-text-secondary hover:text-accent transition-colors" aria-label="Leave">
              <ArrowLeftIcon className="w-4 h-4" />
            </Link>
            <span className="flex items-center gap-1.5 text-sm text-text">
              <span className="w-1.5 h-1.5 rounded-full bg-accent live-dot" />
              tahc
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* timer */}
            <span className={`tabular-nums px-2 py-1 rounded ${low ? 'text-accent' : 'text-text-secondary'}`} title="time left this session">
              {fmt(remaining)}
            </span>
            {/* invite / copy link */}
            <button
              onClick={copyInvite}
              id="invite-btn"
              className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors
                          ${copied ? 'border-success text-success' : 'border-border text-text-secondary hover:border-accent hover:text-accent'}`}
              title="Copy an invite link to this room (valid this session)"
            >
              {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
              <span>{copied ? 'copied' : 'invite'}</span>
            </button>
            {/* online toggle */}
            <button
              onClick={() => setPanelOpen(true)}
              id="online-btn"
              className="flex items-center gap-1 px-2 py-1 rounded border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
              title="Who's online"
            >
              <UsersIcon className="w-3.5 h-3.5" />
              <span className="tabular-nums">{users.length}</span>
            </button>
          </div>
        </div>
      </header>

      <MessagesContainer messages={messages} currentNick={currentUser.nickname} />
      <ChatInput onSendMessage={handleSendMessage} notice={notice} />
      <OnlinePanel users={users} open={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  )
}
