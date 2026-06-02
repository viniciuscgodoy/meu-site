import Image from 'next/image'
import type { Product } from '@/lib/supabase'

function Placeholder() {
  return (
    <div style={{ height: 120, background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
    </div>
  )
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      {product.image_url ? (
        <div style={{ position: 'relative', height: 120, flexShrink: 0 }}>
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      ) : (
        <Placeholder />
      )}

      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.4, margin: 0 }}>
          {product.name}
        </p>

        <span style={{
          fontSize: 10,
          color: '#a78bfa',
          background: 'rgba(124,58,237,0.15)',
          border: '0.5px solid rgba(124,58,237,0.3)',
          borderRadius: 20,
          padding: '2px 8px',
          alignSelf: 'flex-start',
          whiteSpace: 'nowrap',
        }}>
          {product.platform}
        </span>

        <a
          href={product.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          className="product-btn"
          style={{ marginTop: 'auto' }}
        >
          Ver oferta →
        </a>
      </div>
    </div>
  )
}
