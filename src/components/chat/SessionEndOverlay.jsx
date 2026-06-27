import { useState, useEffect } from 'react'

export default function SessionEndOverlay() {
  const [count, setCount] = useState(3)
  useEffect(() => {
    const id = setInterval(() => setCount((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-paper/90 backdrop-blur-sm animate-fade-in">
      <div className="card-brutal !shadow-brutal-lg bg-pink px-10 py-8 text-center -rotate-1 animate-pop-in">
        <p className="font-display font-bold text-2xl text-ink">that's a wrap ✺</p>
        <p className="mt-2 font-mono text-sm text-ink/70">room resets in {count}…</p>
      </div>
    </div>
  )
}
