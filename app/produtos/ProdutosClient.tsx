'use client'

import { useState, useEffect, useRef } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/supabase'

const FILTERS = ['Todos', 'Mercado Livre', 'Shopee', 'Amazon'] as const
type Filter = typeof FILTERS[number]

export default function ProdutosClient({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Filter>('Todos')
  const [animKey, setAnimKey] = useState(0)
  const isFirst = useRef(true)

  const filtered = active === 'Todos'
    ? products
    : products.filter(p => p.platform === active)

  function handleFilter(f: Filter) {
    if (f === active) return
    setActive(f)
    setAnimKey(k => k + 1)
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.28)' }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
        <p style={{ fontSize: 14 }}>Nenhum produto cadastrado ainda.</p>
      </div>
    )
  }

  return (
    <>
      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => handleFilter(f)}
            style={{
              padding: '7px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              border: active === f
                ? '0.5px solid rgba(167,139,250,0.6)'
                : '0.5px solid rgba(150,100,255,0.18)',
              background: active === f
                ? 'rgba(124,58,237,0.3)'
                : 'rgba(255,255,255,0.04)',
              color: active === f ? '#a78bfa' : 'rgba(255,255,255,0.55)',
              transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid com animação ao trocar filtro */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.28)' }}>
          <p style={{ fontSize: 14 }}>Nenhum produto nessa plataforma ainda.</p>
        </div>
      ) : (
        <div
          key={animKey}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}
          className="products-grid"
        >
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 640px) {
          .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
