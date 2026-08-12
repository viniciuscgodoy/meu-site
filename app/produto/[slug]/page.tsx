import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { platformColors } from '@/lib/tokens'
import type { Product } from '@/lib/supabase'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()

  if (data) return data

  if (UUID_RE.test(slug)) {
    const { data: byId } = await supabase
      .from('products')
      .select('*')
      .eq('id', slug)
      .eq('active', true)
      .maybeSingle()
    return byId ?? null
  }

  return null
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  return {
    title: product ? `${product.name} — oviniciusgodoy` : 'Produto não encontrado',
  }
}

function buyLabel(platform: string): string {
  if (platform === 'Mercado Livre') return 'Comprar no Mercado Livre'
  if (platform === 'Shopee') return 'Comprar na Shopee'
  if (platform === 'Amazon') return 'Comprar na Amazon'
  return `Comprar em ${platform}`
}

export default async function ProdutoPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const mainColor = platformColors[product.platform] ?? { bg: '#7c3aed', text: '#ffffff' }
  const secColor  = product.secondary_platform
    ? (platformColors[product.secondary_platform] ?? { bg: '#7c3aed', text: '#ffffff' })
    : null

  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 1.25rem', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        <Link
          href="/produtos"
          style={{ color: 'rgba(167,139,250,0.7)', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}
        >
          ← Voltar
        </Link>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(150,100,255,0.18)',
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>

          {product.image_url ? (
            <div style={{ position: 'relative', width: 200, height: 200, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="200px"
                priority
              />
            </div>
          ) : (
            <div style={{ width: 200, height: 200, borderRadius: 12, background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
              🛍️
            </div>
          )}

          <h1 style={{ color: '#ffffff', fontSize: 17, fontWeight: 600, lineHeight: 1.4, margin: 0, textAlign: 'center' }}>
            {product.name}
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.5, margin: 0, textAlign: 'center' }}>
            Você está em um ambiente de afiliados. Ao continuar, você será redirecionado para a loja parceira — o preço final e a disponibilidade são definidos por ela.
          </p>

          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px 0',
              borderRadius: 10,
              textAlign: 'center',
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
              background: mainColor.bg,
              color: mainColor.text,
              boxSizing: 'border-box',
            }}
          >
            {buyLabel(product.platform)}
          </a>

          {product.secondary_platform && product.secondary_link && secColor && (
            <a
              href={product.secondary_link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 0',
                borderRadius: 10,
                textAlign: 'center',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
                background: secColor.bg,
                color: secColor.text,
                boxSizing: 'border-box',
              }}
            >
              {buyLabel(product.secondary_platform)}
            </a>
          )}

          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0, textAlign: 'center' }}>
            Redirecionamento via oviniciusgodoy.vercel.app
          </p>

        </div>
      </div>
    </main>
  )
}
