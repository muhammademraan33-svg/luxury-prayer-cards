/// <reference lib="deno.ns" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { corsHeaders } from '../_shared/cors.ts'

async function sendEmailIfConfigured(to: string, subject: string, html: string) {
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('RESEND_FROM')
  if (!resendKey || !from) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!stripeSecret || !webhookSecret || !supabaseUrl || !supabaseServiceRole) {
    return new Response('Missing configuration', { status: 500, headers: corsHeaders })
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' })
  const sig = req.headers.get('stripe-signature')
  if (!sig) return new Response('Missing signature', { status: 400, headers: corsHeaders })

  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (_err) {
    return new Response('Invalid signature', { status: 400, headers: corsHeaders })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRole)

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent
      const orderId = pi.metadata?.order_id
      if (orderId) {
        await supabase
          .from('orders')
          .update({
            status: 'processing',
            payment_status: pi.status,
            payment_intent_id: pi.id,
          })
          .eq('id', orderId)

        // Send email if configured
        const { data: order } = await supabase
          .from('orders')
          .select('order_number, customer_email, total')
          .eq('id', orderId)
          .single()

        const email = order?.customer_email as string | null
        if (email) {
          await sendEmailIfConfigured(
            email,
            `Order Confirmed — ${order.order_number}`,
            `<div style="font-family:Arial,sans-serif">\n<h2>Order Confirmed</h2>\n<p>Your order <b>${order.order_number}</b> has been received and is now processing.</p>\n<p><b>Total:</b> $${Number(order.total).toFixed(2)}</p>\n</div>`
          )
        }
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as Stripe.PaymentIntent
      const orderId = pi.metadata?.order_id
      if (orderId) {
        await supabase
          .from('orders')
          .update({
            status: 'payment_failed',
            payment_status: pi.status,
            payment_intent_id: pi.id,
          })
          .eq('id', orderId)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

