import Link from 'next/link'

const links = [
  {
    titulo: 'Produtos em Promoção',
    descricao: 'Curadoria de produtos com melhores preços',
    href: '/produtos',
    icone: '🛍️',
    destaque: true,
    externo: false,
  },
  {
    titulo: 'Canal no YouTube',
    descricao: 'Conteúdo sobre dados, tecnologia e empreendedorismo',
    href: 'https://youtube.com',
    icone: '▶️',
    externo: true,
    destaque: false,
  },
  {
    titulo: 'Mercado Livre',
    descricao: 'Meu perfil com todos os produtos indicados',
    href: 'https://mercadolivre.com.br',
    icone: '🛒',
    externo: true,
    destaque: false,
  },
  {
    titulo: 'Portfolio & Projetos',
    descricao: 'Análises de dados, automações e projetos pessoais',
    href: '/portfolio',
    icone: '📊',
    externo: false,
    destaque: false,
  },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-16 px-4" style={{ background: '#0f0f0f' }}>
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #f97316, #db2777)' }}>
          V
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Vinicius Godoy</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Analista de Dados · Empreendedor Digital
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.externo ? '_blank' : undefined}
              rel={link.externo ? 'noopener noreferrer' : undefined}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group"
              style={link.destaque
                ? { background: 'linear-gradient(90deg, #f97316, #db2777)', color: 'white' }
                : { background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              <span className="text-2xl">{link.icone}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{link.titulo}</p>
                <p className="text-xs mt-0.5 text-gray-400">
                  {link.descricao}
                </p>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          ))}
        </div>

        <p className="text-gray-600 text-xs mt-4">@viniciuscgodoy</p>
      </div>
    </main>
  )
}
