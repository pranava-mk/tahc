import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Chat from './pages/Chat'
import HowTo from './pages/HowTo'

function randomSlug() {
  const a = ['amber', 'quiet', 'lone', 'dusk', 'neon', 'mellow', 'hollow', 'velvet', 'rust', 'pale']
  const n = ['fox', 'moth', 'reef', 'ember', 'crow', 'tide', 'vapor', 'wolf', 'static', 'haze']
  const pick = (x) => x[Math.floor(Math.random() * x.length)]
  return `${pick(a)}-${pick(n)}-${Math.floor(Math.random() * 90 + 10)}`
}

function Landing() {
  const navigate = useNavigate()
  const start = () => navigate(`/${randomSlug()}`)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg font-mono px-6 text-center">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-accent live-dot" />
        <h1 className="text-2xl tracking-tight text-text">tahc</h1>
      </div>
      <p className="text-text-secondary text-sm mb-1">drop into a live conversation with strangers</p>
      <p className="text-text-secondary/50 text-xs mb-8">ephemeral · 11 minutes · nothing kept</p>
      <button onClick={start}
        className="px-5 py-2.5 rounded-md border border-border text-sm text-text hover:border-accent hover:text-accent transition-colors active:scale-[0.98]">
        start a room →
      </button>
      <p className="text-text-secondary/40 text-[11px] mt-6 max-w-xs leading-relaxed">
        you get a private link like <span className="text-text-secondary/70">tahc.app/your-word</span> — share it and whoever has it joins your room until it expires.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/how-to" element={<HowTo />} />
        <Route path="/:slug" element={<Chat />} />
      </Routes>
    </Router>
  )
}
