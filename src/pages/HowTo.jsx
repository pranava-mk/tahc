import MessagesContainer from '../components/chat/MessagesContainer'
import ChatInput from '../components/chat/ChatInput'
import Sidebar from '../components/chat/Sidebar'
import { useChat } from '../hooks/useChat'
import { useSettings } from '../hooks/useSettings'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function HowTo() {
  const { messages, users, handleSendMessage, handleUserClick, clearMessages } = useChat()
  const { settings, updateSetting } = useSettings()

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      {/* Minimal Header */}
      <header className="
        sticky top-0 z-[100]
        bg-bg/95 backdrop-blur-lg
        border-b border-border
        px-8 py-5
      ">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-text-secondary hover:text-accent transition-quick flex items-center gap-2 text-sm font-mono"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <h1 className="text-lg font-medium tracking-tight text-text">
              tahc chat
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
              <UsersIcon className="w-4 h-4" />
              <span>{users.length} online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Messages */}
        <MessagesContainer messages={messages} />

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          placeholder="Type a message... (Try typing / for commands)"
        />

        {/* Sidebar */}
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
