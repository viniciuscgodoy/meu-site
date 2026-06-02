import ProdutosClient from './ProdutosClient'

export default function ProdutosPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 1.25rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <ProdutosClient />
      </div>
    </main>
  )
}
