import MessagesContainer from '../components/chat/MessagesContainer'
import ChatInput from '../components/chat/ChatInput'
import Sidebar from '../components/chat/Sidebar'
import SessionEndOverlay from '../components/chat/SessionEndOverlay'
import { useRoom } from '../hooks/useRoom'
import { useSettings } from '../hooks/useSettings'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/outline'

function fmt(s) {
  if (s == null) return '--:--'
  const m = Math.floor(s / 60)
  const sec = String(s % 60).padStart(2, '0')
  return `${m}:${sec}`
}

export default function Chat() {
  const {
    messages, users, remaining, rotating,
    handleSendMessage, handleUserClick, clearMessages,
  } = useRoom()
  const { settings, updateSetting } = useSettings()
  const low = remaining != null && remaining <= 60

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      {rotating && <SessionEndOverlay />}

      <header className="sticky top-0 z-[100] bg-bg/95 backdrop-blur-lg border-b border-border px-8 py-5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-text-secondary hover:text-accent transition-quick flex items-center gap-2 text-sm font-mono">
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <h1 className="text-lg font-medium tracking-tight text-text">tahc chat</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-mono text-xs ${low ? 'text-warning' : 'text-text-secondary'}`}>
              {fmt(remaining)}
            </span>
            <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
              <UsersIcon className="w-4 h-4" />
              <span>{users.length} online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <MessagesContainer messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} placeholder="Type a message..." />
        <Sidebar
          users={users}
          settings={settings}
          onUserClick={handleUserClick}
          onSettingChange={updateSetting}
          onClearMessages={clearMessages}
        />
      </div>
    </div>
  )
}
