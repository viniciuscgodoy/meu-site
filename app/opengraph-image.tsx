import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Vinícius Godoy'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #08060f, #1a0f2e)',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 44,
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          VG
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 56, fontWeight: 700, color: '#ffffff' }}>
            Vinícius Godoy
          </span>
          <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.45)' }}>
            Analista de Dados · Empreendedor Digital · Afiliado ML &amp; Shopee
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
