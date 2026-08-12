'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import ProductSkeleton from './ProductSkeleton'

const PLATFORMS = ['Todas', 'Mercado Livre', 'Shopee', 'Amazon']
const SORT_OPTIONS = [
  { value: 'recentes', label: 'Mais recentes' },
]

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        border: active ? '1px solid #C9B8FA' : '1px solid transparent',
        background: active ? '#EDE6FE' : '#EFEDF5',
        color: active ? '#7C3AED' : '#6B6675',
        transition: 'background 0.2s, border-color 0.2s, color 0.2s',
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  )
}

export default function ProdutosClient() {
  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [platform, setPlatform]   = useState('Todas')
  const [category, setCategory]   = useState('Todas')
  const [sort, setSort]           = useState('recentes')
  const [animKey, setAnimKey]     = useState(0)
  const [isChanging, setIsChanging] = useState(false)
  const changeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProducts(data ?? [])
        setLoading(false)
      })
  }, [])

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))] as string[]
    return ['Todas', ...cats.sort()]
  }, [products])

  const filtered = useMemo(() => {
    let result = [...products]
    if (platform !== 'Todas') result = result.filter(p => p.platform === platform)
    if (category !== 'Todas') result = result.filter(p => p.category === category)
    return result
  }, [products, platform, category, sort])

  function triggerFilter(fn: () => void) {
    if (changeTimeout.current) clearTimeout(changeTimeout.current)
    setIsChanging(true)
    changeTimeout.current = setTimeout(() => {
      fn()
      setAnimKey(k => k + 1)
      setIsChanging(false)
    }, 150)
  }

  return (
    <>
      <style>{`
        .produtos-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 640px) {
          .produtos-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .produtos-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
        }
        .filter-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .filter-row::-webkit-scrollbar { display: none; }
        @media (min-width: 640px) {
          .filter-row { flex-wrap: wrap; overflow-x: visible; }
        }
        .product-card-v2 {
          background: #FFFFFF;
          border: 1px solid rgba(17,17,17,0.06);
          box-shadow: 0 1px 3px rgba(17,17,17,0.06);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
          cursor: pointer;
        }
        .product-card-v2:hover {
          transform: translateY(-3px);
          border-color: #C9B8FA;
          box-shadow: 0 10px 28px rgba(124,58,237,0.14);
        }
        .product-card-v2:active { transform: scale(0.97); }
        .product-img-wrap { height: 160px; }
        @media (min-width: 1024px) { .product-img-wrap { height: 200px; } }
        .product-name-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #1A1523;
        }
        .product-btn-v2 {
          background: linear-gradient(135deg, rgba(124,58,237,0.4), rgba(37,99,235,0.3));
          color: #c4b5fd;
          border: 0.5px solid rgba(167,139,250,0.3);
          border-radius: 8px;
          width: 100%;
          padding: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          display: block;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .product-btn-v2:hover {
          background: linear-gradient(135deg, rgba(124,58,237,0.65), rgba(37,99,235,0.5));
          color: #ffffff;
        }
        .skeleton-img { height: 160px; }
        @media (min-width: 1024px) { .skeleton-img { height: 200px; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/" style={{ color: '#7C3AED', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
          ← Voltar
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ color: '#1A1523', fontSize: 22, fontWeight: 600, margin: 0 }}>
              Produtos em Promoção 🛍️
            </h1>
            <p style={{ color: '#6B6675', fontSize: 13, marginTop: 6, marginBottom: 0 }}>
              Seleção com os melhores produtos e links de afiliado
            </p>
          </div>
          {!loading && (
            <span style={{
              background: '#EDE6FE',
              border: '1px solid #C9B8FA',
              color: '#7C3AED',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              alignSelf: 'center',
              transition: 'all 0.2s',
            }}>
              {filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {/* Linha 1 — Plataforma */}
        <div className="filter-row">
          {PLATFORMS.map(p => (
            <FilterBtn
              key={p}
              label={p}
              active={platform === p}
              onClick={() => triggerFilter(() => setPlatform(p))}
            />
          ))}
        </div>

        {/* Linha 2 — Categoria (só aparece quando há categorias carregadas) */}
        {categories.length > 1 && (
          <div className="filter-row">
            {categories.map(c => (
              <FilterBtn
                key={c}
                label={c}
                active={category === c}
                onClick={() => triggerFilter(() => setCategory(c))}
              />
            ))}
          </div>
        )}

        {/* Linha 3 — Ordenação */}
        <div className="filter-row">
          {SORT_OPTIONS.map(o => (
            <FilterBtn
              key={o.value}
              label={o.label}
              active={sort === o.value}
              onClick={() => triggerFilter(() => setSort(o.value))}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="produtos-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Estado vazio */
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ color: '#1A1523', fontSize: 16, fontWeight: 500, margin: '0 0 8px' }}>
            Nenhum produto encontrado
          </p>
          <p style={{ color: '#6B6675', fontSize: 13, margin: '0 0 24px' }}>
            Tente outro filtro ou volte em breve
          </p>
          <button
            onClick={() => {
              triggerFilter(() => {
                setPlatform('Todas')
                setCategory('Todas')
                setSort('recentes')
              })
            }}
            style={{
              background: '#EDE6FE',
              border: '1px solid #C9B8FA',
              borderRadius: 20,
              padding: '8px 20px',
              color: '#7C3AED',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Ver todos os produtos
          </button>
        </div>
      ) : (
        <div
          key={animKey}
          className="produtos-grid"
          style={{ opacity: isChanging ? 0 : 1, transition: 'opacity 150ms ease' }}
        >
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
