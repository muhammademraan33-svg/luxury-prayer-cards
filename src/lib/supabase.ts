import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create client with placeholder values if env vars are missing (for demo mode)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  user_type?: 'consumer' | 'funeral_home' | 'admin'
}

export type Order = {
  id: string
  user_id: string | null
  order_number: string
  items: OrderItem[]
  total: number
  customer_email?: string | null
  shipping_address: ShippingAddress | null
  status: 'pending' | 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed'
  payment_intent_id?: string | null
  payment_status?: string | null
  created_at: string
  funeral_home_id?: string
  free_shipping?: boolean
}

import type { DesignData } from '../types/design'

export type OrderItem = {
  id: string
  product_type: 'card' | 'photo_print'
  design_data: DesignData | Record<string, unknown>
  quantity: number
  price: number
}

export type ShippingAddress = {
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
}
