/// <reference lib="deno.ns" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { corsHeaders } from '../_shared/cors.ts'

type CreatePaymentIntentBody = {
  items: unknown
  amount: number // in cents
  currency?: string
  customer_email?: string
  shipping_address?: unknown
  free_shipping?: boolean
  funeral_home_id?: string | null
  user_id?: string | null
  order_number: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecret || !supabaseUrl || !supabaseServiceRole) {
      return new Response(
        JSON.stringify({ error: 'Missing server configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = (await req.json()) as CreatePaymentIntentBody
    const currency = body.currency || 'usd'

    if (!body.amount || body.amount < 50) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!body.order_number) {
      return new Response(
        JSON.stringify({ error: 'Missing order_number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRole)
    const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' })

    // 1) Create DB order first (pending_payment)
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert([{
        user_id: body.user_id || null,
        order_number: body.order_number,
        items: body.items,
        total: (body.amount / 100),
        customer_email: body.customer_email || null,
        shipping_address: body.shipping_address || null,
        status: 'pending_payment',
        funeral_home_id: body.funeral_home_id || null,
        free_shipping: !!body.free_shipping,
        payment_status: 'requires_payment_method',
      }])
      .select('id')
      .single()

    if (orderErr || !order) {
      return new Response(
        JSON.stringify({ error: 'Failed to create order', details: orderErr?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2) Create Stripe payment intent referencing the order
    const pi = await stripe.paymentIntents.create({
      amount: body.amount,
      currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: body.customer_email || undefined,
      metadata: {
        order_id: order.id,
        order_number: body.order_number,
      },
    })

    // 3) Save PI id to DB
    await supabase
      .from('orders')
      .update({ payment_intent_id: pi.id, payment_status: pi.status })
      .eq('id', order.id)

    return new Response(
      JSON.stringify({ clientSecret: pi.client_secret, orderId: order.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

