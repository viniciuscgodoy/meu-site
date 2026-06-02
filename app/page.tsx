import LinkCard from '@/components/LinkCard'

function IconTag() {
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    </div>
  )
}

function IconYoutube() {
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    </div>
  )
}

function IconShopping() {
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(234,179,8,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    </div>
  )
}

function IconChart() {
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    </div>
  )
}

function IconInstagram() {
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    </div>
  )
}

function IconLinkedin() {
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    </div>
  )
}

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 1.25rem' }}>
      <div style={{ maxWidth: 460, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Hero */}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 32, animationDelay: '0ms' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 600,
            color: '#ffffff',
            animation: 'float 4s ease-in-out infinite, pulseRing 4s ease-in-out infinite',
            flexShrink: 0,
          }}>
            VG
          </div>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#ffffff', fontSize: 22, fontWeight: 600, margin: 0 }}>
              Vinícius Godoy
            </h1>
            <p style={{ color: 'rgba(167,139,250,0.8)', fontSize: 13, marginTop: 4 }}>
              @oviniciusgodoy
            </p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
              Analista de Dados · Empreendedor Digital · Afiliado ML &amp; Shopee
            </p>
          </div>
        </div>

        {/* Divisória */}
        <div className="fade-up" style={{
          height: '0.5px',
          background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)',
          marginBottom: 28,
          animationDelay: '100ms',
        }} />

        {/* Links rápidos */}
        <div className="fade-up" style={{ marginBottom: 8, animationDelay: '150ms' }}>
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(167,139,250,0.45)' }}>
            Links rápidos
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <LinkCard
            icon={<IconTag />}
            title="Produtos em Promoção"
            description="Curadoria com os melhores preços"
            href="/produtos"
            badge="novo"
            delay={200}
          />
          <LinkCard
            icon={<IconYoutube />}
            title="Canal no YouTube"
            description="Dados, tecnologia e empreendedorismo"
            href="https://www.youtube.com/@oviniciusgodoy"
            external
            delay={280}
          />
          <LinkCard
            icon={<IconShopping />}
            title="Mercado Livre"
            description="Meu perfil com todos os produtos"
            href="https://www.mercadolivre.com.br/social/govi3580951"
            external
            delay={360}
          />
          <LinkCard
            icon={<IconChart />}
            title="Portfólio & Projetos"
            description="Análises de dados e automações"
            href="/portfolio"
            delay={440}
          />
        </div>

        {/* Divisória */}
        <div className="fade-up" style={{
          height: '0.5px',
          background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)',
          marginBottom: 24,
          animationDelay: '480ms',
        }} />

        {/* Redes sociais */}
        <div className="fade-up" style={{ marginBottom: 8, animationDelay: '500ms' }}>
          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(167,139,250,0.45)' }}>
            Redes sociais
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <LinkCard
            icon={<IconInstagram />}
            title="Instagram"
            description="@oviniciusgodoy"
            href="https://instagram.com/oviniciusgodoy"
            external
            delay={560}
          />
          <LinkCard
            icon={<IconLinkedin />}
            title="LinkedIn"
            description="Vinícius Godoy · Analista de Dados"
            href="https://www.linkedin.com/in/viniciuscgodoy/"
            external
            delay={640}
          />
        </div>

      </div>
    </main>
  )
}
