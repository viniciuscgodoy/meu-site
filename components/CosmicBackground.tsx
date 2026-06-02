'use client'

import { useEffect, useRef } from 'react'

const keyframes = `
@keyframes starMove {
  from { transform: translateY(0); }
  to   { transform: translateY(-600px); }
}
`

export default function CosmicBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    for (let i = 0; i < 55; i++) {
      const star = document.createElement('div')
      const size = 0.5 + Math.random() * 2
      const duration = 15 + Math.random() * 20
      const delay = -(Math.random() * 35)

      star.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: white;
        opacity: ${0.1 + Math.random() * 0.5};
        animation: starMove ${duration}s ${delay}s linear infinite;
        pointer-events: none;
      `
      container.appendChild(star)
    }

    return () => {
      while (container.firstChild) container.removeChild(container.firstChild)
    }
  }, [])

  return (
    <>
      <style>{keyframes}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          background: '#08060f',
        }}
      >
        {/* Orb roxo — top-left */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)',
        }} />

        {/* Orb azul — bottom-right */}
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12), transparent 70%)',
        }} />

        {/* Orb lilás — center-right */}
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '-50px',
          transform: 'translateY(-50%)',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%)',
        }} />

        {/* Container das estrelas geradas via useEffect */}
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
      </div>
    </>
  )
}
