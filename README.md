# tahc - Hyper-Minimalist Chat Showcase

A React-based chat application showcase inspired by hack.chat, built with the tahc design system.

## Features

### Design System
- **tahc Design Language**: Comprehensive design system from Style.md
- **Google M3 Expressive Motion**: Precise timing with subtle bounce effects
- **Nothing OS Aesthetics**: Clean spacing, monospace accents, minimalist UI
- **Notion-Style Minimalism**: Functional animations, distraction-free interface

### Chat Features
- ✅ Real-time message display (simulated)
- ✅ User list with online status
- ✅ Command system (/help, /nick, /whisper, /me, /clear)
- ✅ @mentions highlighting
- ✅ Code syntax highlighting
- ✅ LaTeX equation support
- ✅ Settings panel with customization
- ✅ Dark mode support
- ✅ Collapsible sidebar

### Technical Features
- ⚡ Built with Vite + React
- 🎨 Tailwind CSS with custom tahc config
- 🔄 React Router for navigation
- 📱 Fully responsive design
- ♿ Accessible with keyboard navigation
- 🎭 Smooth animations and transitions

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the app.

### Build

\`\`\`bash
npm run build
\`\`\`

## Routes

- `/` - Home page
- `/how-to` - Chat showcase page

## Project Structure

\`\`\`
src/
├── components/
│   ├── chat/          # Chat-specific components
│   │   ├── Message.jsx
│   │   ├── MessagesContainer.jsx
│   │   ├── ChatInput.jsx
│   │   ├── Sidebar.jsx
│   │   ├── UserList.jsx
│   │   └── SettingsPanel.jsx
│   └── ui/            # Reusable UI components
│       ├── Button.jsx
│       ├── Badge.jsx
│       ├── Toggle.jsx
│       └── Tooltip.jsx
├── hooks/             # Custom React hooks
│   ├── useChat.js
│   └── useSettings.js
├── pages/             # Page components
│   └── HowTo.jsx
├── styles/            # CSS files
│   ├── globals.css
│   └── responsive.css
├── utils/             # Utility functions
│   ├── mockData.js
│   └── messageParser.js
├── App.jsx
└── main.jsx
\`\`\`

## Design System

The project implements the complete tahc design system including:

- **Colors**: Light/dark mode with semantic colors
- **Typography**: Inter font with system fallbacks
- **Spacing**: 8px grid system with micro-spacing
- **Motion**: Expressive easing curves and duration tokens
- **Components**: Buttons, badges, toggles, tooltips, cards

See `Style.md` for complete design specifications.

## Commands

Try these commands in the chat:

- \`/help\` - Show available commands
- \`/nick [name]\` - Change your nickname
- \`/whisper @user [message]\` - Send private message
- \`/me [action]\` - Send emote/action message
- \`/clear\` - Clear all messages

## Features Showcase

### Animations
- 300ms fade-in for messages (Notion-style)
- 150ms quick transitions for micro-interactions
- 500ms expressive spatial movements for modals/drawers
- Subtle bounce effects on interactive elements

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interactions
- Responsive typography scaling

### Accessibility
- Keyboard navigation support
- Focus indicators for keyboard users
- ARIA labels for screen readers
- Reduced motion support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Credits

Inspired by:
- [hack.chat](https://hack.chat) - Minimal anonymous chat
- [Notion](https://notion.so) - Minimalist design philosophy
- [Nothing OS](https://nothing.tech) - Clean aesthetics
- [Google Material Design 3](https://m3.material.io) - Expressive motion system
