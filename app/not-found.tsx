import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.25rem' }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center', position: 'relative', zIndex: 2 }}>

        <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>

        <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 600, margin: '0 0 12px' }}>
          Página não encontrada
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.6, margin: '0 0 32px' }}>
          Esse link não existe ou o produto pode ter sido removido.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          ← Voltar para o início
        </Link>

      </div>
    </main>
  )
}
