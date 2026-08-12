import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/supabase'
import { platformColors } from '@/lib/tokens'

const PLATFORM_COLORS: Record<string, string> = {
  'Mercado Livre': 'rgba(234,179,8,0.15)',
  'Shopee':        'rgba(234,88,12,0.15)',
  'Amazon':        'rgba(251,191,36,0.12)',
}
const PLATFORM_TEXT: Record<string, string> = {
  'Mercado Livre': '#eab308',
  'Shopee':        '#fb923c',
  'Amazon':        '#fbbf24',
}

export default function ProductCard({ product }: { product: Product }) {
  const platBg   = PLATFORM_COLORS[product.platform] ?? 'rgba(124,58,237,0.12)'
  const platText = PLATFORM_TEXT[product.platform]  ?? '#a78bfa'

  const hasChoice = Boolean(product.secondary_platform && product.secondary_link)
  const cta = platformColors[product.platform] ?? { bg: '#7c3aed', text: '#ffffff' }

  return (
    <div className="product-card-v2">
      {/* Área da imagem */}
      <div className="product-img-wrap" style={{ position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#EFEDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            🛍️
          </div>
        )}

        {/* Badge categoria — top left */}
        {product.category && (
          <span style={{
            position: 'absolute', top: 8, left: 8,
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(17,17,17,0.08)',
            borderRadius: 6, padding: '2px 6px',
            color: '#4B5563', fontSize: 10,
            lineHeight: 1.4,
          }}>
            {product.category}
          </span>
        )}
      </div>

      {/* Corpo */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <p className="product-name-clamp" style={{ fontSize: 13, lineHeight: 1.4, margin: 0 }}>
          {product.name}
        </p>

        <span style={{
          fontSize: 10, fontWeight: 500,
          color: platText, background: platBg,
          border: `0.5px solid ${platText}40`,
          borderRadius: 20, padding: '2px 8px',
          alignSelf: 'flex-start', whiteSpace: 'nowrap',
        }}>
          {product.platform}
        </span>

        {hasChoice ? (
          <Link
            href={`/produto/${product.slug || product.id}`}
            className="product-btn-v2"
            style={{ marginTop: 'auto', background: cta.bg, color: cta.text }}
          >
            Ver oferta →
          </Link>
        ) : (
          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="product-btn-v2"
            style={{ marginTop: 'auto', background: cta.bg, color: cta.text }}
          >
            Ver oferta →
          </a>
        )}
      </div>
    </div>
  )
}
