import ProdutosClient from './ProdutosClient'
import { lightTheme } from '@/lib/tokens'

export default function ProdutosPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 1.25rem' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: lightTheme.bg }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <ProdutosClient />
      </div>
    </main>
  )
}
