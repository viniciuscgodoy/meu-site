import { NextRequest, NextResponse } from 'next/server'

// Rate limit best-effort: reseta se a função serverless "esfriar" na Vercel.
// Para proteção mais robusta, use um store externo como Redis/Upstash.
// Cobre bots simples de força bruta.
const attempts = new Map<string, { count: number; resetAt: number }>()

const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000 // 10 minutos

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const now = Date.now()

  const entry = attempts.get(ip)
  if (entry && now < entry.resetAt && entry.count >= LIMIT) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
      { status: 429 }
    )
  }

  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: 'Senha obrigatória' }, { status: 400 })
  }

  const expected = (process.env.ADMIN_PASSWORD ?? '').replace(/﻿/g, '').trim()
  const received = String(password).replace(/﻿/g, '').trim()

  if (received !== expected) {
    const current = entry && now < entry.resetAt ? entry : { count: 0, resetAt: now + WINDOW_MS }
    attempts.set(ip, { count: current.count + 1, resetAt: current.resetAt })
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  attempts.delete(ip)
  return NextResponse.json({ ok: true })
}
