import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'
import ProdutosClient from './ProdutosClient'

export const revalidate = 60

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export default async function ProdutosPage() {
  const products = await getProducts()

  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 1.25rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        <div style={{ marginBottom: 24 }}>
          <Link href="/" style={{ color: 'rgba(167,139,250,0.7)', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
            ← Voltar
          </Link>
          <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 600, margin: 0 }}>
            Produtos em Promoção 🛍️
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 6 }}>
            Seleção com os melhores preços e links de afiliado
          </p>
        </div>

        <ProdutosClient products={products} />
      </div>
    </main>
  )
}
