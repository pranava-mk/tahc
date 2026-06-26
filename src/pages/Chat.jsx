import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
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

function randomSlug() {
  const a = ['amber', 'quiet', 'lone', 'dusk', 'neon', 'mellow', 'hollow', 'velvet', 'rust', 'pale']
  const n = ['fox', 'moth', 'reef', 'ember', 'crow', 'tide', 'vapor', 'wolf', 'static', 'haze']
  const pick = (x) => x[Math.floor(Math.random() * x.length)]
  return `${pick(a)}-${pick(n)}-${Math.floor(Math.random() * 90 + 10)}`
}

function StatusScreen({ title, sub, cta }) {
  const navigate = useNavigate()
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-bg font-mono text-center px-6">
      <p className="text-text mb-2">{title}</p>
      {sub && <p className="text-text-secondary text-xs mb-6">{sub}</p>}
      {cta && (
        <button onClick={() => navigate(`/${randomSlug()}`)}
          className="px-4 py-2 rounded-md border border-border text-sm text-text hover:border-accent hover:text-accent transition-colors">
          {cta}
        </button>
      )}
      <Link to="/" className="mt-4 text-xs text-text-secondary/60 hover:text-accent">home</Link>
    </div>
  )
}

export default function Chat() {
  const { slug } = useParams()
  const { messages, users, currentUser, remaining, rotating, notice, inviteUrl, status, statusMeta, handleSendMessage } = useRoom(slug)
  const [panelOpen, setPanelOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const low = remaining != null && remaining <= 60

  if (status === 'loading') return <StatusScreen title="connecting to the room…" />
  if (status === 'room_full') return <StatusScreen title="this room is full" sub={`max 7 people. a fresh room is one click away.`} cta="start a new room" />
  if (status === 'expired') return <StatusScreen title="this link has expired" sub={statusMeta ? `free again in ~${statusMeta} min` : 'the conversation is gone'} cta="start a new room" />
  if (status === 'ended') return <StatusScreen title="this conversation has ended" sub="ephemeral by design — nothing was kept" cta="start a new room" />
  if (status === 'error') return <StatusScreen title="something went wrong" cta="start a new room" />

  const copyInvite = async () => {
    if (!inviteUrl) return
    try { await navigator.clipboard.writeText(inviteUrl) }
    catch {
      const ta = document.createElement('textarea'); ta.value = inviteUrl
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove()
    }
    setCopied(true); setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden font-mono">
      {rotating && <SessionEndOverlay />}

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
            <span className={`tabular-nums px-2 py-1 rounded ${low ? 'text-accent' : 'text-text-secondary'}`} title="time left this room">{fmt(remaining)}</span>
            <button onClick={copyInvite} id="invite-btn"
              className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${copied ? 'border-success text-success' : 'border-border text-text-secondary hover:border-accent hover:text-accent'}`}
              title="Copy this room's link (valid this session)">
              {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
              <span>{copied ? 'copied' : 'invite'}</span>
            </button>
            <button onClick={() => setPanelOpen(true)} id="online-btn"
              className="flex items-center gap-1 px-2 py-1 rounded border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors" title="Who's online">
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
