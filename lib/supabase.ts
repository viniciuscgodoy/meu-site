import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createServiceClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export type Produto = {
  id: number
  titulo: string
  imagem_url: string
  preco: string | null
  link_afiliado: string
  plataforma: string
  ativo: boolean
  created_at: string
}

export type LinkBio = {
  id: number
  titulo: string
  url: string
  icone: string
  ordem: number
  ativo: boolean
}
