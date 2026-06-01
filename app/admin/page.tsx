'use client'

import { useState, useEffect } from 'react'
import type { Produto } from '@/lib/supabase'

export default function AdminPage() {
  const [senha, setSenha] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [url, setUrl] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [scrapando, setScrapando] = useState(false)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [form, setForm] = useState({ titulo: '', imagem_url: '', preco: '', link_afiliado: '', plataforma: 'outro' })
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    const salva = sessionStorage.getItem('admin_auth')
    if (salva) setAutenticado(true)
  }, [])

  useEffect(() => {
    if (autenticado) carregarProdutos()
  }, [autenticado])

  async function carregarProdutos() {
    const res = await fetch('/api/produtos', { headers: { 'x-admin-password': sessionStorage.getItem('admin_auth') || '' } })
    const data = await res.json()
    if (Array.isArray(data)) setProdutos(data)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/produtos', { headers: { 'x-admin-password': senha } })
    if (res.ok) {
      sessionStorage.setItem('admin_auth', senha)
      setAutenticado(true)
    } else {
      setMensagem('Senha incorreta')
    }
  }

  async function handleScrape() {
    if (!url) return
    setScrapando(true)
    setForm(prev => ({ ...prev, link_afiliado: url }))
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      setForm({
        titulo: data.titulo || '',
        imagem_url: data.imagem || '',
        preco: data.preco || '',
        link_afiliado: url,
        plataforma: data.plataforma || 'outro',
      })
    } catch {
      setMensagem('Erro ao buscar informações do produto')
    } finally {
      setScrapando(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    try {
      const res = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': sessionStorage.getItem('admin_auth') || '' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setMensagem('Produto adicionado com sucesso!')
        setUrl('')
        setForm({ titulo: '', imagem_url: '', preco: '', link_afiliado: '', plataforma: 'outro' })
        carregarProdutos()
      } else {
        const err = await res.json()
        setMensagem(err.error || 'Erro ao salvar produto')
      }
    } finally {
      setCarregando(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Remover este produto?')) return
    await fetch('/api/produtos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': sessionStorage.getItem('admin_auth') || '' },
      body: JSON.stringify({ id }),
    })
    carregarProdutos()
  }

  if (!autenticado) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0f0f0f' }}>
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white text-center">Admin</h1>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="px-4 py-3 rounded-xl text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
          />
          {mensagem && <p className="text-red-400 text-sm text-center">{mensagem}</p>}
          <button type="submit" className="py-3 rounded-xl font-semibold text-white" style={{ background: 'linear-gradient(90deg, #f97316, #db2777)' }}>
            Entrar
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: '#0f0f0f' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Painel Admin</h1>

        <div className="p-6 rounded-2xl mb-8" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-lg font-semibold text-white mb-4">Adicionar Produto</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="url"
              placeholder="Cole o link do produto (Mercado Livre, Shopee...)"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            />
            <button
              onClick={handleScrape}
              disabled={scrapando || !url}
              className="px-4 py-3 rounded-xl text-white text-sm font-medium transition-opacity disabled:opacity-50"
              style={{ background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.4)' }}
            >
              {scrapando ? '...' : 'Buscar'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Título do produto"
              value={form.titulo}
              onChange={e => setForm(prev => ({ ...prev, titulo: e.target.value }))}
              className="px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              required
            />
            <input
              type="url"
              placeholder="URL da imagem"
              value={form.imagem_url}
              onChange={e => setForm(prev => ({ ...prev, imagem_url: e.target.value }))}
              className="px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            />
            {form.imagem_url && (
              <img src={form.imagem_url} alt="Preview" className="w-24 h-24 object-cover rounded-xl" />
            )}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Preço (ex: R$ 49,90)"
                value={form.preco}
                onChange={e => setForm(prev => ({ ...prev, preco: e.target.value }))}
                className="flex-1 px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              />
              <select
                value={form.plataforma}
                onChange={e => setForm(prev => ({ ...prev, plataforma: e.target.value }))}
                className="px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <option value="mercadolivre">Mercado Livre</option>
                <option value="shopee">Shopee</option>
                <option value="amazon">Amazon</option>
                <option value="magalu">Magalu</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <input
              type="url"
              placeholder="Link de afiliado"
              value={form.link_afiliado}
              onChange={e => setForm(prev => ({ ...prev, link_afiliado: e.target.value }))}
              className="px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              required
            />

            {mensagem && (
              <p className={`text-sm text-center ${mensagem.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>
                {mensagem}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="py-3 rounded-xl font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(90deg, #f97316, #db2777)' }}
            >
              {carregando ? 'Salvando...' : 'Publicar Produto'}
            </button>
          </form>
        </div>

        <h2 className="text-lg font-semibold text-white mb-4">Produtos cadastrados ({produtos.length})</h2>
        <div className="flex flex-col gap-3">
          {produtos.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {p.imagem_url && (
                <img src={p.imagem_url} alt={p.titulo} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{p.titulo}</p>
                <p className="text-gray-500 text-xs">{p.plataforma} {p.preco && `· ${p.preco}`}</p>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded-lg transition-colors flex-shrink-0"
                style={{ background: 'rgba(239,68,68,0.1)' }}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
