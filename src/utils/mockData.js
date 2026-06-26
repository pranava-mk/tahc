// Mock data for chat demonstration - No emojis, clean and minimal

export const mockUsers = [
  { id: 1, nickname: 'alice', tripcode: '#v1b2c3', online: true },
  { id: 2, nickname: 'bob', tripcode: null, online: true },
  { id: 3, nickname: 'charlie#abc123', tripcode: '#x9y8z7', online: true },
  { id: 4, nickname: 'developer', tripcode: null, online: true },
]

export const mockMessages = [
  {
    id: 1,
    type: 'info',
    text: 'Welcome to tahc chat. Type /help to see available commands.',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 2,
    type: 'info',
    text: 'alice has joined the channel',
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: 3,
    type: 'chat',
    user: 'alice',
    text: 'Hey everyone, good to be here',
    timestamp: new Date(Date.now() - 3400000),
  },
  {
    id: 4,
    type: 'info',
    text: 'bob has joined the channel',
    timestamp: new Date(Date.now() - 3300000),
  },
  {
    id: 5,
    type: 'chat',
    user: 'bob',
    text: 'Hi alice, how are you?',
    timestamp: new Date(Date.now() - 3200000),
  },
  {
    id: 6,
    type: 'chat',
    user: 'alice',
    text: 'Pretty good. Working on some code. Check this out:\n\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n```',
    timestamp: new Date(Date.now() - 3100000),
  },
  {
    id: 7,
    type: 'info',
    text: 'charlie#abc123 has joined the channel',
    timestamp: new Date(Date.now() - 3000000),
  },
  {
    id: 8,
    type: 'chat',
    user: 'charlie#abc123',
    text: 'Nice, that is a classic recursion example.',
    timestamp: new Date(Date.now() - 2900000),
  },
  {
    id: 9,
    type: 'emote',
    user: 'alice',
    text: 'shares a coffee',
    timestamp: new Date(Date.now() - 2800000),
  },
  {
    id: 10,
    type: 'chat',
    user: 'bob',
    text: 'By the way, did you know you can use LaTeX here? Like this: $E = mc^2$',
    timestamp: new Date(Date.now() - 2700000),
  },
  {
    id: 11,
    type: 'info',
    text: 'developer has joined the channel',
    timestamp: new Date(Date.now() - 2600000),
  },
  {
    id: 12,
    type: 'chat',
    user: 'developer',
    text: '@alice that fibonacci implementation could be optimized with memoization',
    timestamp: new Date(Date.now() - 2500000),
  },
  {
    id: 13,
    type: 'chat',
    user: 'alice',
    text: 'Good point. Here is the optimized version:\n\n```javascript\nconst fib = (n, memo = {}) => {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n  return memo[n];\n};\n```',
    timestamp: new Date(Date.now() - 2400000),
  },
  {
    id: 14,
    type: 'chat',
    user: 'charlie#abc123',
    text: 'Much better. That changes the time complexity from O(2^n) to O(n).',
    timestamp: new Date(Date.now() - 2300000),
  },
  {
    id: 15,
    type: 'chat',
    user: 'bob',
    text: 'I love how minimal this chat is. No distractions, just pure conversation.',
    timestamp: new Date(Date.now() - 2200000),
  },
]

export const commandHelp = [
  { command: '/help', description: 'Show available commands' },
  { command: '/nick [name]', description: 'Change your nickname' },
  { command: '/whisper @user [message]', description: 'Send a private message' },
  { command: '/me [action]', description: 'Send an emote/action message' },
  { command: '/clear', description: 'Clear all messages from your view' },
]

export const settings = {
  audioNotifications: true,
  desktopNotifications: false,
  showJoinLeave: true,
  enableLatex: true,
  enableSyntaxHighlight: true,
  showImages: true,
}
