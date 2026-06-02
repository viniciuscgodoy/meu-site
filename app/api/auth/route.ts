import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: 'Senha obrigatória' }, { status: 400 })
  }

  const expected = (process.env.ADMIN_PASSWORD ?? '').replace(/﻿/g, '').trim()
  const received = String(password).replace(/﻿/g, '').trim()

  if (received !== expected) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
