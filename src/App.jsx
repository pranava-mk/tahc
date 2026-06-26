import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HowTo from './pages/HowTo'
import Chat from './pages/Chat'

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6 tracking-tighter">tahc</h1>
        <p className="text-text-secondary mb-8">Hyper-Minimalist Productivity</p>
        <Link
          to="/chat"
          className="btn btn-primary inline-block"
        >
          Drop into a live conversation
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/how-to" element={<HowTo />} />
      </Routes>
    </Router>
  )
}

export default App
