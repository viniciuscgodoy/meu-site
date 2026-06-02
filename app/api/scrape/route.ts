import { NextRequest, NextResponse } from 'next/server'

type Category =
  | 'Eletrônicos'
  | 'Informática'
  | 'Casa & Decoração'
  | 'Moda & Beleza'
  | 'Esporte & Lazer'
  | 'Ferramentas'
  | 'Bebês & Kids'
  | 'Automotivo'
  | 'Outros'

const CATEGORY_KEYWORDS: Partial<Record<Category, string[]>> = {
  'Eletrônicos': [
    'celular', 'smartphone', 'iphone', 'samsung', 'tv', 'televisão', 'televisor',
    'fone', 'headphone', 'earphone', 'airpod', 'câmera', 'camera', 'speaker',
    'caixa de som', 'smartwatch', 'relógio inteligente', 'tablet', 'kindle',
    'áudio', 'audio', 'projetor', 'dvd', 'blu-ray',
  ],
  'Informática': [
    'notebook', 'computador', 'desktop', 'laptop', 'mouse', 'teclado', 'monitor',
    'hd externo', 'ssd', 'pendrive', 'memória ram', 'placa de vídeo', 'processador',
    'impressora', 'webcam', 'hub usb', 'cabo usb', 'roteador', 'modem', 'nobreak',
  ],
  'Casa & Decoração': [
    'sofá', 'sofa', 'mesa', 'cadeira', 'cama', 'colchão', 'travesseiro', 'cobertor',
    'edredom', 'panela', 'frigideira', 'liquidificador', 'batedeira', 'cafeteira',
    'aspirador', 'ventilador', 'ar condicionado', 'geladeira', 'fogão', 'micro-ondas',
    'luminária', 'tapete', 'cortina', 'toalha', 'vassoura', 'organizador',
  ],
  'Moda & Beleza': [
    'camiseta', 'calça', 'vestido', 'tênis', 'sapato', 'sandália', 'bolsa', 'mochila',
    'óculos', 'perfume', 'shampoo', 'condicionador', 'maquiagem', 'batom', 'creme',
    'protetor solar', 'depilador', 'secador', 'chapinha', 'barbeador', 'hidratante',
    'relógio', 'joia', 'brinco', 'pulseira', 'colar',
  ],
  'Esporte & Lazer': [
    'bicicleta', 'bike', 'futebol', 'bola', 'chuteira', 'academia', 'haltere',
    'musculação', 'natação', 'corrida', 'camping', 'barraca', 'pesca', 'skate',
    'patins', 'raquete', 'luva', 'corda de pular',
  ],
  'Ferramentas': [
    'furadeira', 'parafuso', 'chave de fenda', 'martelo', 'alicate', 'fita métrica',
    'nível', 'serra', 'lixadeira', 'esmerilhadeira', 'compressor', 'mangueira',
    'pistola', 'chave inglesa', 'torquímetro',
  ],
  'Bebês & Kids': [
    'fralda', 'brinquedo', 'carrinho de bebê', 'berço', 'mamadeira', 'chupeta',
    'body infantil', 'roupinha', 'lego', 'boneca', 'carrinho de brinquedo',
    'escorregador', 'balanço', 'andador',
  ],
  'Automotivo': [
    'carro', 'moto', 'pneu', 'rodas', 'óleo motor', 'filtro de óleo', 'bateria automotiva',
    'gps veicular', 'suporte veicular', 'carregador veicular', 'película automotiva',
    'tapete automotivo', 'câmera ré', 'retrovisores',
  ],
}

function mapToCategory(text: string): Category {
  if (!text) return 'Outros'
  const lower = text.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Category, string[]][]) {
    if (keywords.some(k => lower.includes(k))) return cat
  }
  return 'Outros'
}

function extractJsonLd(html: string): { category?: string; price?: number } {
  const result: { category?: string; price?: number } = {}
  const matches = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)

  for (const match of matches) {
    try {
      const json = JSON.parse(match[1])
      const objs: Record<string, unknown>[] = Array.isArray(json) ? json : [json]
      for (const obj of objs) {
        if (typeof obj.category === 'string' && !result.category) {
          result.category = obj.category
        }
        const offers = obj.offers as Record<string, unknown> | undefined
        if (offers && !result.price) {
          const raw = (Array.isArray(offers) ? offers[0]?.price : offers.price) as string | number | undefined
          if (raw !== undefined) {
            const num = parseFloat(String(raw).replace(',', '.'))
            if (!isNaN(num) && num > 0) result.price = num
          }
        }
      }
    } catch { /* JSON inválido */ }
  }
  return result
}

function parsePrice(html: string): number | null {
  const patterns = [
    /"price":\s*"?([\d]+(?:[.,][\d]{1,2})?)"?/,
    /itemprop=["']price["'][^>]*content=["']([\d.,]+)["']/i,
    /R\$\s*([\d]{1,3}(?:[.][\d]{3})*(?:,[\d]{2})?)/,
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) {
      // Formato BR: 1.299,90 → 1299.90
      const raw = match[1].replace(/\./g, '').replace(',', '.')
      const num = parseFloat(raw)
      if (!isNaN(num) && num > 0 && num < 1_000_000) return num
    }
  }
  return null
}

function detectCategory(html: string, name: string, jsonLdCategory?: string): Category {
  // 1. JSON-LD tem categoria → mapeia direto
  if (jsonLdCategory) {
    const mapped = mapToCategory(jsonLdCategory)
    if (mapped !== 'Outros') return mapped
  }

  // 2. Breadcrumb do ML: <ol class="andes-breadcrumb"> ou similar
  const breadcrumbMatch = html.match(
    /breadcrumb[\s\S]*?<a[^>]*>([^<]{3,50})<\/a>/i
  )
  if (breadcrumbMatch) {
    const mapped = mapToCategory(breadcrumbMatch[1])
    if (mapped !== 'Outros') return mapped
  }

  // 3. Fallback: inferir pelo título do produto
  return mapToCategory(name)
}

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'URL obrigatória' }, { status: 400 })

  let platform: 'Mercado Livre' | 'Shopee' | 'Amazon' | null = null
  if (url.includes('mercadolivre') || url.includes('mercadolibre')) platform = 'Mercado Livre'
  else if (url.includes('shopee')) platform = 'Shopee'
  else if (url.includes('amazon')) platform = 'Amazon'

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    })

    const html = await res.text()

    const getMeta = (property: string) => {
      const m =
        html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'))
      return m ? m[1] : ''
    }
    const getMetaName = (name: string) => {
      const m =
        html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'))
      return m ? m[1] : ''
    }
    const getTitleTag = () => {
      const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      return m ? m[1].trim() : ''
    }

    const name      = getMeta('og:title') || getMetaName('title') || getTitleTag()
    const image_url = getMeta('og:image') || getMetaName('thumbnail') || ''
    const jsonLd    = extractJsonLd(html)
    const price     = jsonLd.price ?? parsePrice(html)
    const category  = detectCategory(html, name, jsonLd.category)

    return NextResponse.json({ name, price, image_url, platform, category })
  } catch {
    return NextResponse.json({ error: 'Não foi possível obter informações do produto' }, { status: 500 })
  }
}
