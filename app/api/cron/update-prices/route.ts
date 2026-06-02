import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  const secret = process.env.CRON_SECRET ?? ''

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('id, affiliate_link, price')
    .eq('active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const list = products ?? []

  // URL base: usa a URL de produção do Vercel quando disponível
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

  let updated = 0
  let failed = 0

  await Promise.allSettled(
    list.map(async (product) => {
      try {
        const scrapeRes = await fetch(`${baseUrl}/api/scrape`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: product.affiliate_link }),
          signal: AbortSignal.timeout(12000),
        })

        if (!scrapeRes.ok) { failed++; return }

        const data = await scrapeRes.json()

        if (data.error || data.price == null) { failed++; return }

        // Só atualiza se o preço realmente mudou
        if (data.price === product.price) return

        const { error: updateError } = await supabase
          .from('products')
          .update({
            price: data.price,
            price_updated_at: new Date().toISOString(),
          })
          .eq('id', product.id)

        if (updateError) { failed++; return }

        updated++
      } catch {
        failed++
      }
    })
  )

  return NextResponse.json({ updated, failed, total: list.length })
}
