import { NextResponse } from 'next/server'

// Rota legada — redireciona para /api/products
export async function GET() {
  return NextResponse.redirect(new URL('/api/products', 'https://oviniciusgodoy.vercel.app'), 308)
}
