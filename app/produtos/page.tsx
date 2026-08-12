import ProdutosClient from './ProdutosClient'
import { lightTheme } from '@/lib/tokens'
import LightOrbBackground from '@/components/LightOrbBackground'

export default function ProdutosPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '1.5rem 1.25rem' }}>
      <LightOrbBackground />
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
        background: lightTheme.glassBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid ' + lightTheme.glassBorder,
        borderRadius: 24,
        boxShadow: lightTheme.glassShadow,
        padding: '2rem',
      }}>
        <ProdutosClient />
      </div>
    </main>
  )
}
