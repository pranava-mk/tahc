import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon, UsersIcon, LinkIcon, CheckIcon } from '@heroicons/react/24/solid'
import MessagesContainer from '../components/chat/MessagesContainer'
import ChatInput from '../components/chat/ChatInput'
import OnlinePanel from '../components/chat/OnlinePanel'
import SessionEndOverlay from '../components/chat/SessionEndOverlay'
import { useRoom } from '../hooks/useRoom'

function fmt(s) {
  if (s == null) return '--:--'
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
function randomSlug() {
  const a = ['amber', 'quiet', 'lone', 'dusk', 'neon', 'mellow', 'rust', 'rowdy']
  const n = ['fox', 'moth', 'reef', 'ember', 'crow', 'tide', 'comet', 'gremlin']
  const p = (x) => x[Math.floor(Math.random() * x.length)]
  return `${p(a)}-${p(n)}-${Math.floor(Math.random() * 90 + 10)}`
}

function StatusScreen({ emoji, title, sub, cta }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6 text-center">
      <div className="card-brutal !shadow-brutal-lg bg-card px-8 py-8 max-w-sm -rotate-1 animate-pop-in">
        <div className="text-5xl mb-3 animate-wobble inline-block">{emoji}</div>
        <p className="font-display font-bold text-xl text-ink">{title}</p>
        {sub && <p className="mt-2 font-mono text-xs text-muted">{sub}</p>}
        {cta && (
          <button onClick={() => navigate(`/${randomSlug()}`)} className="btn-brutal btn-pink mt-6">{cta}</button>
        )}
        <div className="mt-3"><Link to="/" className="font-mono text-xs text-muted underline hover:text-ink">home</Link></div>
      </div>
    </div>
  )
}

export default function Chat() {
  const { slug } = useParams()
  const { messages, users, currentUser, remaining, rotating, notice, inviteUrl, status, statusMeta, handleSendMessage } = useRoom(slug)
  const [panelOpen, setPanelOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const low = remaining != null && remaining <= 60

  if (status === 'loading') return <StatusScreen emoji="✺" title="dropping you in…" />
  if (status === 'room_full') return <StatusScreen emoji="🚪" title="this room is full" sub="max 7 humans. grab a fresh one." cta="START A NEW ROOM →" />
  if (status === 'expired') return <StatusScreen emoji="⏳" title="this link expired" sub={statusMeta ? `free again in ~${statusMeta} min` : 'the convo is gone'} cta="START A NEW ROOM →" />
  if (status === 'ended') return <StatusScreen emoji="✨" title="that conversation's gone" sub="ephemeral by design — nothing kept" cta="START A NEW ROOM →" />
  if (status === 'error') return <StatusScreen emoji="💥" title="something broke" cta="TRY A NEW ROOM →" />

  const copyInvite = async () => {
    if (!inviteUrl) return
    try { await navigator.clipboard.writeText(inviteUrl) }
    catch { const ta = document.createElement('textarea'); ta.value = inviteUrl; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove() }
    setCopied(true); setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="h-screen flex flex-col bg-paper overflow-hidden">
      {rotating && <SessionEndOverlay />}

      <header className="shrink-0 border-b-3 border-ink bg-yellow">
        <div className="max-w-3xl mx-auto px-3 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-brutal bg-card !p-1.5 !rounded-brutal-sm" aria-label="Leave"><ArrowLeftIcon className="w-4 h-4" /></Link>
            <span className="flex items-center gap-1.5 font-display font-bold text-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-pink border-2 border-ink live-dot" />tahc
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`tag-brutal tabular-nums ${low ? 'bg-pink animate-blink' : 'bg-card'}`}>{fmt(remaining)}</span>
            <button onClick={copyInvite} id="invite-btn" className={`btn-brutal !px-2.5 !py-1.5 text-xs ${copied ? 'btn-lime' : 'bg-card'}`} title="copy this room's link">
              {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
              <span>{copied ? 'copied!' : 'invite'}</span>
            </button>
            <button onClick={() => setPanelOpen(true)} id="online-btn" className="btn-brutal bg-card !px-2.5 !py-1.5 text-xs" title="who's online">
              <UsersIcon className="w-3.5 h-3.5" /><span className="tabular-nums">{users.length}</span>
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
