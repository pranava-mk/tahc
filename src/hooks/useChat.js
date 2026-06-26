import { useState, useCallback } from 'react'
import { mockMessages as initialMessages, mockUsers } from '../utils/mockData'
import { parseCommand } from '../utils/messageParser'

export function useChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [users, setUsers] = useState(mockUsers)
  const [currentUser, setCurrentUser] = useState({ nickname: 'you', id: 999 })

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, {
      ...message,
      id: prev.length + 1,
      timestamp: new Date(),
    }])
  }, [])

  const handleSendMessage = useCallback((text) => {
    const command = parseCommand(text)

    // Handle commands
    if (command) {
      switch (command.command) {
        case 'help':
          addMessage({
            type: 'info',
            text: 'Available commands: /help, /nick [name], /whisper @user [message], /me [action], /clear',
          })
          return

        case 'nick':
          if (command.args.length > 0) {
            const newNick = command.args.join(' ')
            addMessage({
              type: 'info',
              text: `${currentUser.nickname} changed their nickname to ${newNick}`,
            })
            setCurrentUser((prev) => ({ ...prev, nickname: newNick }))
          } else {
            addMessage({
              type: 'warn',
              text: 'Usage: /nick [new_nickname]',
            })
          }
          return

        case 'whisper':
          if (command.args.length >= 2) {
            const targetUser = command.args[0].replace('@', '')
            const messageText = command.args.slice(1).join(' ')
            addMessage({
              type: 'info',
              text: `[Whisper to ${targetUser}]: ${messageText}`,
            })
          } else {
            addMessage({
              type: 'warn',
              text: 'Usage: /whisper @username [message]',
            })
          }
          return

        case 'me':
        case 'emote':
          if (command.args.length > 0) {
            addMessage({
              type: 'emote',
              user: currentUser.nickname,
              text: command.args.join(' '),
            })
          }
          return

        case 'clear':
          setMessages([{
            id: 1,
            type: 'info',
            text: 'Messages cleared. This is a fresh start!',
            timestamp: new Date(),
          }])
          return

        default:
          addMessage({
            type: 'warn',
            text: `Unknown command: /${command.command}. Type /help for available commands.`,
          })
          return
      }
    }

    // Regular chat message
    addMessage({
      type: 'chat',
      user: currentUser.nickname,
      text,
    })

    // Simulate response (for demo)
    setTimeout(() => {
      const responses = [
        'That\'s interesting!',
        'I agree 👍',
        'Tell me more about that',
        'Nice!',
        'Exactly what I was thinking',
      ]
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      addMessage({
        type: 'chat',
        user: randomUser.nickname,
        text: randomResponse,
      })
    }, 2000 + Math.random() * 2000)
  }, [currentUser, users, addMessage])

  const handleUserClick = useCallback((user) => {
    // This would typically add @mention to input
    // For now, just show an info message
    addMessage({
      type: 'info',
      text: `@${user.nickname} - Click to mention this user in your message`,
    })
  }, [addMessage])

  const clearMessages = useCallback(() => {
    setMessages([{
      id: 1,
      type: 'info',
      text: 'All messages have been cleared.',
      timestamp: new Date(),
    }])
  }, [])

  return {
    messages,
    users,
    currentUser,
    handleSendMessage,
    handleUserClick,
    clearMessages,
  }
}
