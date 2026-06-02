import Link from 'next/link'

const projetos = [
  {
    title: 'Dashboard SMS/GIO - Petrobras',
    description: 'Dashboard de indicadores de Saúde, Meio Ambiente e Segurança para análise gerencial.',
    tags: ['Power BI', 'SQL', 'Petrobras'],
    status: 'Em andamento',
  },
]

const habilidades = [
  { categoria: 'Dados', itens: ['Power BI', 'SQL', 'Excel Avançado', 'Python'] },
  { categoria: 'Tecnologia', itens: ['Automações', 'APIs', 'Next.js', 'Node.js'] },
  { categoria: 'Negócios', itens: ['Marketing Digital', 'Afiliados', 'YouTube', 'Instagram'] },
]

export default function PortfolioPage() {
  return (
    <main className="min-h-screen px-4 py-12" style={{ background: '#0f0f0f' }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">← Voltar</Link>

        <div className="mt-8 flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4" style={{ background: 'linear-gradient(135deg, #f97316, #db2777)' }}>
            V
          </div>
          <h1 className="text-3xl font-bold text-white">Vinicius Godoy</h1>
          <p className="text-gray-400 mt-2 max-w-md">
            Analista de Dados na Petrobras e empreendedor digital. Apaixonado por transformar dados em decisões e criar negócios com tecnologia.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="mailto:vigodoy.contato@gmail.com" className="text-xs px-4 py-2 rounded-full text-white transition-colors hover:opacity-80" style={{ background: 'rgba(255,255,255,0.1)' }}>
              ✉️ Contato
            </a>
            <a href="https://www.youtube.com/@oviniciusgodoy" target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-full text-white transition-colors hover:opacity-80" style={{ background: 'rgba(255,255,255,0.1)' }}>
              ▶️ YouTube
            </a>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Habilidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {habilidades.map((grupo) => (
              <div key={grupo.categoria} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="text-orange-400 font-semibold text-sm mb-3">{grupo.categoria}</p>
                <div className="flex flex-wrap gap-2">
                  {grupo.itens.map((item) => (
                    <span key={item} className="text-xs px-2 py-1 rounded-lg text-gray-300" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Projetos</h2>
          {projetos.length === 0 ? (
            <p className="text-gray-500 text-sm">Em breve...</p>
          ) : (
            <div className="flex flex-col gap-4">
              {projetos.map((projeto) => (
                <div key={projeto.title} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-white font-semibold">{projeto.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full text-orange-400 whitespace-nowrap" style={{ background: 'rgba(249,115,22,0.1)' }}>
                      {projeto.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{projeto.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {projeto.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-lg text-gray-400" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
