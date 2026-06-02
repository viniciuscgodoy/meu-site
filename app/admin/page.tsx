'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Product } from '@/lib/supabase'

const PLATFORMS = ['Mercado Livre', 'Shopee', 'Amazon']

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const hide = setTimeout(() => setHiding(true), 2800)
    const remove = setTimeout(onDone, 3200)
    return () => { clearTimeout(hide); clearTimeout(remove) }
  }, [onDone])

  return <div className={`toast${hiding ? ' hide' : ''}`}>{message}</div>
}

const emptyForm = { name: '', image_url: '', affiliate_link: '', platform: 'Mercado Livre' }

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
    } catch {
      // silently ignore — lista não carregou
    }
  }, [])

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw')
    if (saved) { setAutenticado(true); }
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
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getPassword() },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setForm(emptyForm)
        setToast('Produto adicionado com sucesso ✓')
        fetchProducts()
      } else {
        const err = await res.json()
        setToast(err.error || 'Erro ao salvar')
      }
    } catch (err) {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: form.affiliate_link }),
      })
      const data = await res.json()
      if (data.error) { setToast('Não foi possível buscar o produto'); return }
      setForm(prev => ({
        ...prev,
        name: data.titulo || prev.name,
        image_url: data.imagem || prev.image_url,
        platform: data.plataforma === 'mercadolivre' ? 'Mercado Livre'
          : data.plataforma === 'shopee' ? 'Shopee'
          : data.plataforma === 'amazon' ? 'Amazon'
          : prev.platform,
      }))
    } catch {
      setToast('Erro ao buscar informações')
    } finally {
      setBuscando(false)
    }
  }

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
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#ffffff', border: 'none', borderRadius: 10, padding: 12, fontWeight: 500, fontSize: 14, cursor: 'pointer', opacity: 1, transition: 'opacity 0.2s' }}
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

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 600, margin: 0 }}>Painel Admin</h1>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f87171', background: 'rgba(239,68,68,0.12)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '3px 8px' }}>
            restrito
          </span>
        </div>

        {/* Formulário */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(150,100,255,0.18)', borderRadius: 14, padding: '20px 20px', marginBottom: 28 }}>
          <h2 style={{ color: '#ffffff', fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>Adicionar produto</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              className="admin-input"
              placeholder="Nome do produto *"
              value={form.name}
              onChange={set('name')}
              required
            />

            <select className="admin-input" value={form.platform} onChange={set('platform')}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <input
              className="admin-input"
              type="text"
              placeholder="URL da imagem"
              value={form.image_url}
              onChange={set('image_url')}
            />

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
            {form.image_url && (
              <img src={form.image_url} alt="Preview" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '0.5px solid rgba(150,100,255,0.2)' }} />
            )}

            <button
              type="submit"
              disabled={salvando}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#ffffff', border: 'none', borderRadius: 10, padding: 12, fontWeight: 500, fontSize: 14, cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.6 : 1, marginTop: 4, transition: 'opacity 0.2s' }}
              onMouseOver={e => { if (!salvando) e.currentTarget.style.opacity = '0.9' }}
              onMouseOut={e => { if (!salvando) e.currentTarget.style.opacity = '1' }}
            >
              {salvando ? 'Salvando...' : 'Adicionar produto'}
            </button>
          </form>
        </div>

        {/* Lista de produtos */}
        <div>
          <h2 style={{ color: '#ffffff', fontSize: 15, fontWeight: 600, margin: '0 0 12px' }}>
            Produtos cadastrados <span style={{ color: 'rgba(167,139,250,0.6)', fontWeight: 400, fontSize: 13 }}>({products.length})</span>
          </h2>

          {products.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>Nenhum produto cadastrado.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {products.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(150,100,255,0.18)', borderRadius: 12, padding: '10px 14px' }}>
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#ffffff', fontSize: 13, fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '2px 0 0' }}>
                      {p.platform}
                    </p>
                  </div>

                  {/* Toggle ativo */}
                  <label className="toggle" title={p.active ? 'Ativo' : 'Inativo'}>
                    <input
                      type="checkbox"
                      checked={p.active}
                      onChange={e => handleToggle(p.id, e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>

                  {/* Lixeira */}
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
