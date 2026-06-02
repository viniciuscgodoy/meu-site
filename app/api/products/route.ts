import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function isAuthorized(req: NextRequest) {
  const received = (req.headers.get('x-admin-password') ?? '').replace(/﻿/g, '').trim()
  const expected = (process.env.ADMIN_PASSWORD ?? '').replace(/﻿/g, '').trim()
  return received === expected
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { name, image_url, affiliate_link, platform, category, price, price_updated_at } = body

  if (!name || !affiliate_link) {
    return NextResponse.json({ error: 'Nome e link de afiliado são obrigatórios' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      image_url: image_url || null,
      affiliate_link,
      platform: platform || 'Mercado Livre',
      category: category || null,
      price: price ?? null,
      price_updated_at: price_updated_at ?? null,
      active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id, active } = await req.json()
  const supabase = createServiceClient()
  const { error } = await supabase.from('products').update({ active }).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await req.json()
  const supabase = createServiceClient()
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
