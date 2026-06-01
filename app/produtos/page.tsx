import { supabase, type Produto } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 60

async function getProdutos(): Promise<Produto[]> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export default async function ProdutosPage() {
  const produtos = await getProdutos()

  return (
    <main className="min-h-screen px-4 py-12" style={{ background: '#0f0f0f' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">← Voltar</Link>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Produtos em Promoção 🛍️</h1>
        <p className="text-gray-400 mb-8">Seleção dos melhores produtos com links de afiliado</p>

        {produtos.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">📦</p>
            <p>Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {produtos.map((produto) => (
              <a
                key={produto.id}
                href={produto.link_afiliado}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl overflow-hidden transition-transform hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="aspect-square overflow-hidden bg-gray-800">
                  {produto.imagem_url ? (
                    <img
                      src={produto.imagem_url}
                      alt={produto.titulo}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <p className="text-white text-sm font-medium line-clamp-2 leading-tight">{produto.titulo}</p>
                  {produto.preco && (
                    <p className="text-orange-400 font-bold text-base">{produto.preco}</p>
                  )}
                  <div className="mt-auto">
                    <span className="inline-block text-xs px-3 py-1.5 rounded-full font-semibold text-white w-full text-center" style={{ background: 'linear-gradient(90deg, #f97316, #db2777)' }}>
                      Ver produto →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
