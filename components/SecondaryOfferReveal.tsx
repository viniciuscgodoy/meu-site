'use client'
import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'

export default function SecondaryOfferReveal({
  platform, link, bg, text, label,
}: { platform: string; link: string; bg: string; text: string; label: string }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1600)
    return () => clearTimeout(t)
  }, [])

  if (!ready) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', padding: '12px 0', borderRadius: 10,
        background: '#F1F0F6', color: '#6B6675',
        fontSize: 13, fontWeight: 500, boxSizing: 'border-box',
      }}>
        <span className="offer-spinner" />
        Procurando oferta parecida na {platform}...
      </div>
    )
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="fade-up"
      onClick={() => track('click_produto_secundario', { plataforma: platform })}
      style={{
        display: 'block', width: '100%', padding: '12px 0', borderRadius: 10,
        textAlign: 'center', fontWeight: 600, fontSize: 14, textDecoration: 'none',
        background: bg, color: text, boxSizing: 'border-box',
      }}
    >
      {label}
    </a>
  )
}
