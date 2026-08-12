import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createServiceClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export type Product = {
  id: string
  name: string
  image_url: string | null
  affiliate_link: string
  platform: 'Mercado Livre' | 'Shopee' | 'Amazon' | string
  category: string | null
  active: boolean
  created_at: string
  slug: string | null
  secondary_platform: 'Mercado Livre' | 'Shopee' | 'Amazon' | null
  secondary_link: string | null
}
