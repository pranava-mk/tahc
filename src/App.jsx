import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import HowTo from './pages/HowTo'

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
