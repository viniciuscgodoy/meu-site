import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { url } = await req.json()

  if (!url) {
    return NextResponse.json({ error: 'URL obrigatória' }, { status: 400 })
  }

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

    const getMeta = (property: string): string => {
      const match =
        html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'))
      return match ? match[1] : ''
    }

    const getMetaName = (name: string): string => {
      const match =
        html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'))
      return match ? match[1] : ''
    }

    const getTitleTag = (): string => {
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      return match ? match[1].trim() : ''
    }

    const name = getMeta('og:title') || getMetaName('title') || getTitleTag()
    const image_url = getMeta('og:image') || getMetaName('thumbnail')
    const description = getMeta('og:description') || getMetaName('description')

    let price = ''
    const priceMatch =
      html.match(/["']price["'][^>]*>(R\$\s*[\d.,]+)/i) ||
      html.match(/(R\$\s*[\d.,]+)/i)
    if (priceMatch) price = priceMatch[1].trim()

    let platform = 'other'
    if (url.includes('mercadolivre') || url.includes('mercadolibre')) platform = 'mercadolivre'
    else if (url.includes('shopee')) platform = 'shopee'
    else if (url.includes('amazon')) platform = 'amazon'
    else if (url.includes('magalu') || url.includes('magazineluiza')) platform = 'magalu'

    return NextResponse.json({ name, image_url, description, price, platform })
  } catch {
    return NextResponse.json({ error: 'Não foi possível obter informações do produto' }, { status: 500 })
  }
}
