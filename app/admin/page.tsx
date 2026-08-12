'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Product } from '@/lib/supabase'

const PLATFORMS = ['Mercado Livre', 'Shopee', 'Amazon']
const ALL_PLATFORMS = ['Todas', ...PLATFORMS]

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const [hiding, setHiding] = useState(false)
  useEffect(() => {
    const hide = setTimeout(() => setHiding(true), 2800)
    const remove = setTimeout(onDone, 3200)
    return () => { clearTimeout(hide); clearTimeout(remove) }
  }, [onDone])
  return <div className={`toast${hiding ? ' hide' : ''}`}>{message}</div>
}

const emptyForm = {
  name: '',
  image_url: '',
  affiliate_link: '',
  platform: 'Mercado Livre',
  category: '',
  secondary_platform: '',
  secondary_link: '',
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [autenticado, setAutenticado] = useState(false)
  const [authError, setAuthError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [salvando, setSalvando] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [toast, setToast] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('Todas')

  const getPassword = () => {
    const raw = sessionStorage.getItem('admin_pw') ?? ''
    return raw.split('').filter(c => {
      const code = c.charCodeAt(0)
      return code >= 32 && code <= 126
    }).join('').trim()
  }

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products', {
        headers: { 'x-admin-password': getPassword() },
      })
      if (res.ok) setProducts(await res.json())
    } catch { /* silently ignore */ }
  }, [])

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw')
    if (saved) setAutenticado(true)
  }, [])

  useEffect(() => {
    if (autenticado) fetchProducts()
  }, [autenticado, fetchProducts])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      sessionStorage.setItem('admin_pw', password.split('').filter(c => { const n = c.charCodeAt(0); return n >= 32 && n <= 126 }).join('').trim())
      setAutenticado(true)
    } else {
      setAuthError('Senha incorreta')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    try {
      if (editingId) {
        const res = await fetch('/api/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': getPassword() },
          body: JSON.stringify({
            id: editingId,
            name: form.name,
            image_url: form.image_url || null,
            affiliate_link: form.affiliate_link,
            platform: form.platform,
            category: form.category || null,
            secondary_platform: form.secondary_platform || null,
            secondary_link: form.secondary_link || null,
            slug: form.name ? toSlug(form.name) : '',
          }),
        })
        if (res.ok) {
          setForm(emptyForm)
          setEditingId(null)
          setToast('Produto atualizado com sucesso ✓')
          fetchProducts()
        } else {
          const err = await res.json()
          setToast(err.error || 'Erro ao atualizar')
        }
      } else {
        const payload = {
          ...form,
          secondary_platform: form.secondary_platform || null,
          secondary_link: form.secondary_link || null,
          slug: form.name ? toSlug(form.name) : '',
        }
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': getPassword() },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          setForm(emptyForm)
          setToast('Produto adicionado com sucesso ✓')
          fetchProducts()
        } else {
          const err = await res.json()
          setToast(err.error || 'Erro ao salvar')
        }
      }
    } catch {
      setToast('Erro de conexão ao salvar')
    } finally {
      setSalvando(false)
    }
  }

  async function handleToggle(id: string, active: boolean) {
    try {
      await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getPassword() },
        body: JSON.stringify({ id, active }),
      })
      fetchProducts()
    } catch {
      setToast('Erro ao atualizar produto')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este produto permanentemente?')) return
    try {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getPassword() },
        body: JSON.stringify({ id }),
      })
      if (editingId === id) { setEditingId(null); setForm(emptyForm) }
      fetchProducts()
    } catch {
      setToast('Erro ao remover produto')
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  async function handleScrape() {
    if (!form.affiliate_link) return
    setBuscando(true)
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getPassword() },
        body: JSON.stringify({ url: form.affiliate_link }),
      })
      const data = await res.json()
      if (data.error) { setToast('Não foi possível buscar o produto'); return }
      setForm(prev => ({
        ...prev,
        name:      data.name      || prev.name,
        image_url: data.image_url || prev.image_url,
        category:  data.category  || prev.category,
        platform:  data.platform  || prev.platform,
      }))
    } catch {
      setToast('Erro ao buscar informações')
    } finally {
      setBuscando(false)
    }
  }

  const stats = {
    total: products.length,
    active: products.filter(p => p.active).length,
    byPlatform: PLATFORMS.map(pl => ({ platform: pl, count: products.filter(p => p.platform === pl).length })),
  }

  const filteredProducts = products
    .filter(p => search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => filterPlatform === 'Todas' || p.platform === filterPlatform)

  /* ── TELA DE LOGIN ── */
  if (!autenticado) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', zIndex: 2 }}>
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 600, margin: 0 }}>Painel Admin</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 6 }}>Digite a senha para continuar</p>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="admin-input"
              style={{ paddingRight: 40 }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center' }}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {authError && <p style={{ color: '#f87171', fontSize: 13, textAlign: 'center', margin: 0 }}>{authError}</p>}

          <button
            type="submit"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#ffffff', border: 'none', borderRadius: 10, padding: 12, fontWeight: 500, fontSize: 14, cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            Entrar
          </button>
        </form>
      </main>
    )
  }

  /* ── PAINEL PRINCIPAL ── */
  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 1.25rem', position: 'relative', zIndex: 2 }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 600, margin: 0 }}>Painel Admin</h1>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f87171', background: 'rgba(239,68,68,0.12)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '3px 8px' }}>
            restrito
          </span>
        </div>

        {/* Formulário */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(150,100,255,0.18)', borderRadius: 14, padding: '20px', marginBottom: 28 }}>
          <h2 style={{ color: '#ffffff', fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>
            {editingId ? 'Editar produto' : 'Adicionar produto'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Link + Buscar */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="admin-input"
                type="text"
                placeholder="Link de afiliado *"
                value={form.affiliate_link}
                onChange={set('affiliate_link')}
                required
              />
              <button
                type="button"
                onClick={handleScrape}
                disabled={buscando || !form.affiliate_link}
                title="Buscar informações do produto automaticamente"
                style={{ flexShrink: 0, background: 'rgba(124,58,237,0.2)', border: '0.5px solid rgba(124,58,237,0.4)', borderRadius: 8, padding: '0 14px', color: '#a78bfa', fontSize: 13, fontWeight: 500, cursor: buscando || !form.affiliate_link ? 'not-allowed' : 'pointer', opacity: buscando || !form.affiliate_link ? 0.5 : 1, whiteSpace: 'nowrap', transition: 'opacity 0.2s' }}
              >
                {buscando ? '...' : '🔍 Buscar'}
              </button>
            </div>

            <input
              className="admin-input"
              placeholder="Nome do produto *"
              value={form.name}
              onChange={set('name')}
              required
            />

            {/* Plataforma */}
            <select className="admin-input" value={form.platform} onChange={set('platform')}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            {/* Segunda plataforma + segundo link */}
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                className="admin-input"
                value={form.secondary_platform}
                onChange={set('secondary_platform')}
                style={{ flex: '0 0 160px' }}
              >
                <option value="">2ª plataforma</option>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input
                className="admin-input"
                type="text"
                placeholder="Segundo link de afiliado"
                value={form.secondary_link}
                onChange={set('secondary_link')}
                disabled={!form.secondary_platform}
                style={{ flex: 1, opacity: form.secondary_platform ? 1 : 0.4 }}
              />
            </div>

            {/* Categoria */}
            <div style={{ position: 'relative' }}>
              <input
                className="admin-input"
                type="text"
                placeholder="Categoria"
                value={form.category}
                onChange={set('category')}
              />
              {form.category && (
                <span style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 10, fontWeight: 600, color: '#a78bfa',
                  background: 'rgba(124,58,237,0.2)', border: '0.5px solid rgba(124,58,237,0.35)',
                  borderRadius: 20, padding: '2px 8px', pointerEvents: 'none',
                }}>
                  detectado
                </span>
              )}
            </div>

            {/* Slug — somente leitura */}
            <div style={{ position: 'relative' }}>
              <input
                className="admin-input"
                type="text"
                placeholder="Slug (gerado automaticamente)"
                value={form.name ? toSlug(form.name) : ''}
                readOnly
                style={{ opacity: 0.55, cursor: 'default', fontSize: 12 }}
              />
              {form.name && (
                <span style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 10, fontWeight: 600, color: 'rgba(167,139,250,0.6)',
                  pointerEvents: 'none',
                }}>
                  auto
                </span>
              )}
            </div>

            <input
              className="admin-input"
              type="text"
              placeholder="URL da imagem"
              value={form.image_url}
              onChange={set('image_url')}
            />

            {form.image_url && (
              <img src={form.image_url} alt="Preview" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '0.5px solid rgba(150,100,255,0.2)' }} />
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                type="submit"
                disabled={salvando}
                style={{ flex: 1, background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#ffffff', border: 'none', borderRadius: 10, padding: 12, fontWeight: 500, fontSize: 14, cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.6 : 1, transition: 'opacity 0.2s' }}
                onMouseOver={e => { if (!salvando) e.currentTarget.style.opacity = '0.9' }}
                onMouseOut={e => { if (!salvando) e.currentTarget.style.opacity = '1' }}
              >
                {salvando ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Adicionar produto'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm(emptyForm) }}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista */}
        <div>
          <h2 style={{ color: '#ffffff', fontSize: 15, fontWeight: 600, margin: '0 0 12px' }}>
            Produtos cadastrados <span style={{ color: 'rgba(167,139,250,0.6)', fontWeight: 400, fontSize: 13 }}>({products.length})</span>
          </h2>

          {/* Estatísticas */}
          {products.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(150,100,255,0.15)', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>{stats.total}</span> produtos
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(150,100,255,0.15)', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ fontWeight: 600, color: '#4ade80' }}>{stats.active}</span> ativos
              </div>
              {stats.byPlatform.filter(b => b.count > 0).map(b => (
                <div key={b.platform} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(150,100,255,0.15)', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  {b.platform}: <span style={{ fontWeight: 600, color: '#fff' }}>{b.count}</span>
                </div>
              ))}
            </div>
          )}

          {/* Busca + filtro de plataforma */}
          {products.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              <input
                className="admin-input"
                type="text"
                placeholder="Buscar produto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ALL_PLATFORMS.map(pl => (
                  <button
                    key={pl}
                    onClick={() => setFilterPlatform(pl)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: filterPlatform === pl ? '0.5px solid rgba(167,139,250,0.5)' : '0.5px solid rgba(150,100,255,0.15)',
                      background: filterPlatform === pl ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)',
                      color: filterPlatform === pl ? '#a78bfa' : 'rgba(255,255,255,0.45)',
                      transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                    }}
                  >
                    {pl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>Nenhum produto cadastrado.</p>
          ) : filteredProducts.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>Nenhum produto encontrado com esse filtro.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: editingId === p.id ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.04)',
                    border: editingId === p.id ? '0.5px solid rgba(167,139,250,0.4)' : '0.5px solid rgba(150,100,255,0.18)',
                    borderRadius: 12, padding: '10px 14px',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '2px 0 0' }}>
                      {p.platform}{p.category ? ` · ${p.category}` : ''}
                    </p>
                  </div>

                  <a
                    href={`/produto/${p.slug || p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver página do produto"
                    style={{ color: 'rgba(167,139,250,0.6)', fontSize: 11, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, transition: 'color 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.color = '#a78bfa')}
                    onMouseOut={e => (e.currentTarget.style.color = 'rgba(167,139,250,0.6)')}
                  >
                    Ver ↗
                  </a>

                  <button
                    onClick={() => {
                      setEditingId(p.id)
                      setForm({
                        name: p.name,
                        image_url: p.image_url || '',
                        affiliate_link: p.affiliate_link,
                        platform: p.platform,
                        category: p.category || '',
                        secondary_platform: p.secondary_platform || '',
                        secondary_link: p.secondary_link || '',
                      })
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    title="Editar produto"
                    style={{ background: 'rgba(124,58,237,0.1)', border: '0.5px solid rgba(124,58,237,0.3)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', flexShrink: 0, color: '#a78bfa', fontSize: 12, fontWeight: 500, transition: 'background 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.22)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.1)')}
                  >
                    Editar
                  </button>

                  <label className="toggle" title={p.active ? 'Ativo' : 'Inativo'}>
                    <input type="checkbox" checked={p.active} onChange={e => handleToggle(p.id, e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>

                  <button
                    onClick={() => handleDelete(p.id)}
                    title="Remover produto"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.22)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </main>
  )
}
