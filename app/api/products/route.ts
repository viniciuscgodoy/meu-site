import { NextRequest, NextResponse } from 'next/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase'

function isAuthorized(req: NextRequest) {
  const received = (req.headers.get('x-admin-password') ?? '').replace(/﻿/g, '').trim()
  const expected = (process.env.ADMIN_PASSWORD ?? '').replace(/﻿/g, '').trim()
  return received === expected
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function uniqueSlug(supabase: SupabaseClient, base: string, excludeId?: string): Promise<string> {
  let candidate = base
  let suffix = 2
  while (true) {
    let query = supabase.from('products').select('id').eq('slug', candidate)
    if (excludeId) query = query.neq('id', excludeId)
    const { data } = await query
    if (!data || data.length === 0) return candidate
    candidate = `${base}-${suffix}`
    suffix++
  }
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
  const { name, image_url, affiliate_link, platform, category, price, price_updated_at, slug, secondary_platform, secondary_link } = body

  if (!name || !affiliate_link) {
    return NextResponse.json({ error: 'Nome e link de afiliado são obrigatórios' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const baseSlug = slug?.trim() || toSlug(name)
  const finalSlug = await uniqueSlug(supabase, baseSlug)

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
      slug: finalSlug,
      secondary_platform: secondary_platform || null,
      secondary_link: secondary_link || null,
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

  const body = await req.json()
  const { id, active, name, slug, secondary_platform, secondary_link } = body

  const updates: Record<string, unknown> = {}
  if (active !== undefined) updates.active = active
  if (name !== undefined) updates.name = name
  if (secondary_platform !== undefined) updates.secondary_platform = secondary_platform || null
  if (secondary_link !== undefined) updates.secondary_link = secondary_link || null

  if (name !== undefined || slug !== undefined) {
    const supabase = createServiceClient()
    const baseSlug = slug?.trim() || (name ? toSlug(name) : '')
    if (baseSlug) updates.slug = await uniqueSlug(supabase, baseSlug, id)
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('products').update(updates).eq('id', id)

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
