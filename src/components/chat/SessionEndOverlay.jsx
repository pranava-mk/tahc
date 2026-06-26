import { useState, useEffect } from 'react'

// Full-screen transition shown while the room rotates to a new session.
export default function SessionEndOverlay() {
  const [count, setCount] = useState(3)
  useEffect(() => {
    const id = setInterval(() => setCount((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-bg/95 backdrop-blur-lg animate-fade-in">
      <div className="text-center">
        <p className="text-lg font-medium text-text mb-2">Session ended</p>
        <p className="text-sm text-text-secondary font-mono">
          New session in {count}…
        </p>
      </div>
    </div>
  )
}
