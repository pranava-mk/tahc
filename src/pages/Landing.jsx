import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { gsap } from 'gsap'

function randomSlug() {
  const a = ['amber', 'quiet', 'lone', 'dusk', 'neon', 'mellow', 'hollow', 'velvet', 'rust', 'pale', 'fuzzy', 'rowdy']
  const n = ['fox', 'moth', 'reef', 'ember', 'crow', 'tide', 'vapor', 'wolf', 'static', 'haze', 'comet', 'gremlin']
  const p = (x) => x[Math.floor(Math.random() * x.length)]
  return `${p(a)}-${p(n)}-${Math.floor(Math.random() * 90 + 10)}`
}

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const rootRef = useRef(null)

  // three.js — floating neo-brutalist shapes that drift + parallax to the mouse
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100)
    camera.position.z = 6
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

    const colors = [0x3b5bff, 0xff4d8d, 0xb8ff3b, 0xffd43b, 0x9d4edd, 0x54e6e0]
    const geos = [
      new THREE.IcosahedronGeometry(0.95, 0),
      new THREE.TorusGeometry(0.7, 0.28, 10, 22),
      new THREE.BoxGeometry(1.15, 1.15, 1.15),
      new THREE.DodecahedronGeometry(0.95, 0),
      new THREE.ConeGeometry(0.8, 1.4, 6),
      new THREE.OctahedronGeometry(1, 0),
    ]
    const meshes = []
    for (let i = 0; i < 7; i++) {
      const geo = geos[i % geos.length]
      const mat = new THREE.MeshStandardMaterial({ color: colors[i % colors.length], flatShading: true, roughness: 0.55, metalness: 0 })
      const mesh = new THREE.Mesh(geo, mat)
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x111111 }))
      mesh.add(edges)
      mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3 - 1)
      mesh.userData = { sp: 0.4 + Math.random(), ph: Math.random() * Math.PI * 2 }
      scene.add(mesh)
      meshes.push(mesh)
    }
    const dir = new THREE.DirectionalLight(0xffffff, 2.2); dir.position.set(3, 5, 4); scene.add(dir)
    scene.add(new THREE.AmbientLight(0xffffff, 0.75))

    let mx = 0, my = 0
    const onMove = (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5 }
    addEventListener('mousemove', onMove)
    const onResize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight) }
    addEventListener('resize', onResize)

    let raf, t = 0
    const tick = () => {
      t += 0.016
      meshes.forEach((m) => { m.rotation.x += 0.006 * m.userData.sp; m.rotation.y += 0.008 * m.userData.sp; m.position.y += Math.sin(t + m.userData.ph) * 0.0035 })
      camera.position.x += (mx * 1.4 - camera.position.x) * 0.05
      camera.position.y += (-my * 0.9 - camera.position.y) * 0.05
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      cancelAnimationFrame(raf); removeEventListener('mousemove', onMove); removeEventListener('resize', onResize)
      geos.forEach((g) => g.dispose()); meshes.forEach((m) => m.material.dispose()); renderer.dispose()
    }
  }, [])

  // GSAP — entrance + perpetual float on stickers
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-anim]', { y: 26, opacity: 0, scale: 0.94, stagger: 0.08, duration: 0.6, ease: 'back.out(1.7)', delay: 0.1 })
      gsap.to('[data-float]', { y: '+=12', rotate: '+=4', duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.3 })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const start = () => navigate(`/${randomSlug()}`)
  const words = ['drop in', 'talk fast', 'it disappears', 'no trace', '11 minutes', 'strangers only']

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden bg-paper">
      <canvas ref={canvasRef} className="fixed inset-0" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="flex items-center justify-between px-5 sm:px-8 py-5">
          <span data-anim className="tag-brutal bg-lime shadow-brutal-sm"><span className="w-2 h-2 rounded-full bg-ink live-dot" /> LIVE</span>
          <span data-anim className="tag-brutal bg-card shadow-brutal-sm">ephemeral · 11:00</span>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center text-center px-5">
          <h1 data-anim className="font-display font-bold text-[26vw] sm:text-[16rem] leading-[0.8] tracking-tightest text-ink drop-shadow-[6px_6px_0_#FF4D8D]">tahc</h1>
          <p data-anim className="mt-6 font-display text-xl sm:text-3xl font-medium max-w-2xl leading-snug">
            drop into a live room full of strangers.{' '}
            <span className="bg-pink px-2 border-3 border-ink rounded-brutal-sm inline-block -rotate-2 shadow-brutal-sm">talk fast.</span>{' '}
            it vanishes in 11 minutes.
          </p>
          <button data-anim onClick={start} className="btn-brutal btn-pink mt-10 text-lg sm:text-xl px-9 py-4">START A ROOM →</button>
          <p data-anim className="mt-5 font-mono text-xs text-muted">you get a link like <span className="text-ink font-bold">tahc.app/your-word</span> — share it, they drop in.</p>
        </main>

        <span data-float className="hidden md:flex absolute top-32 left-10 tag-brutal bg-yellow -rotate-6 text-base shadow-brutal">no logins</span>
        <span data-float className="hidden md:flex absolute top-44 right-14 tag-brutal bg-cyan rotate-6 text-base shadow-brutal">🫥 anonymous</span>
        <span data-float className="hidden md:flex absolute bottom-40 left-20 tag-brutal bg-blue text-card -rotate-3 text-base shadow-brutal">⚡ realtime</span>
        <span data-float className="hidden md:flex absolute bottom-32 right-20 tag-brutal bg-purple text-card rotate-3 text-base shadow-brutal">🔥 every room is alive</span>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-10 border-t-3 border-ink bg-ink text-paper overflow-hidden scroll-none">
        <div className="flex whitespace-nowrap animate-marquee py-2 font-mono text-sm font-bold uppercase">
          {[0, 1].map((k) => (
            <span key={k} className="flex">
              {words.map((w, j) => <span key={j} className="mx-5">{w} ✺</span>)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
