import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from '@stripe/react-stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import type { StripeAddressElement } from '@stripe/stripe-js'
import { useCartStore } from '../lib/store'
import { supabase } from '../lib/supabase'
import { stripePromise } from '../lib/stripe'
import { generateOrderNumber, formatPrice } from '../lib/utils'
import { toast } from 'react-hot-toast'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)

  const [user, setUser] = useState<{ id?: string; user_metadata?: { user_type?: string } } | null>(null)
  const [isFuneralHome, setIsFuneralHome] = useState(false)
  const [isFuneralHomeCheckbox, setIsFuneralHomeCheckbox] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          user_metadata: session.user.user_metadata as { user_type?: string },
        })
        if (session.user.user_metadata?.user_type === 'funeral_home') {
          setIsFuneralHome(true)
          setIsFuneralHomeCheckbox(true)
        }
      }
    })
  }, [])

  // Free shipping if logged in as funeral home OR checkbox checked
  const hasFreeShipping = isFuneralHome || isFuneralHomeCheckbox

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
      return
    }

    // Create payment intent via Supabase Edge Function (production-ready)
    const createPaymentIntent = async () => {
      try {
        const subtotal = getTotal()
        const shipping = hasFreeShipping ? 0 : 5.99
        const tax = subtotal * 0.08
        const total = subtotal + shipping + tax

        const orderNumber = generateOrderNumber()
        const amount = Math.round(total * 100)

        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: {
            items,
            amount,
            order_number: orderNumber,
            customer_email: email || null,
            shipping_address: null, // collected at submit time
            free_shipping: hasFreeShipping,
            funeral_home_id: hasFreeShipping ? (user?.id || null) : null,
            user_id: user?.id || null,
          },
        })

        if (error) throw error
        setClientSecret(data?.clientSecret || null)
        setOrderId(data?.orderId || null)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        toast.error('Unable to start checkout. Check your Supabase/Stripe setup.')
      }
    }

    createPaymentIntent()
  }, [items, getTotal, hasFreeShipping, navigate])

  const elementsOptions = useMemo(() => {
    return clientSecret ? { clientSecret, appearance: { theme: 'stripe' as const } } : undefined
  }, [clientSecret])

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {hasFreeShipping && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              🎉 Free shipping applied {isFuneralHome ? 'for Funeral Home account' : 'for Funeral Home order'}
            </p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFuneralHomeCheckbox}
              onChange={(e) => setIsFuneralHomeCheckbox(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">
              I'm placing this order for a funeral home (Free shipping applies - no login required)
            </span>
          </label>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Contact</h2>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {clientSecret && elementsOptions ? (
              <Elements stripe={stripePromise} options={elementsOptions}>
                <CheckoutInner
                  orderId={orderId}
                  hasFreeShipping={hasFreeShipping}
                  getTotal={getTotal}
                  clearCart={clearCart}
                />
              </Elements>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-2">Payment</h2>
                <p className="text-gray-600">Preparing secure payment…</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

function CheckoutInner({
  orderId,
  hasFreeShipping,
  getTotal,
  clearCart,
}: {
  orderId: string | null
  hasFreeShipping: boolean
  getTotal: () => number
  clearCart: () => void
}) {
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = getTotal()
  const shipping = hasFreeShipping ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    try {
      // Collect address from element
      const addressEl = elements.getElement(AddressElement) as StripeAddressElement | null
      const addressValue = addressEl ? await addressEl.getValue() : null

      // Confirm payment and redirect to confirmation page.
      const shippingAddress = addressValue?.value?.address
        ? {
            ...addressValue.value.address,
            line2: addressValue.value.address.line2 ?? undefined,
          }
        : undefined
      const shippingParam =
        addressValue?.value?.name && shippingAddress
          ? {
              name: addressValue.value.name,
              address: shippingAddress,
            }
          : undefined

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation/${orderId || ''}`,
          shipping: shippingParam,
        },
      })

      if (result.error) {
        throw result.error
      }

      // On redirect, we won’t reach here.
      clearCart()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed'
      toast.error(message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        <AddressElement options={{ mode: 'shipping' }} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Payment Information</h2>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className={hasFreeShipping ? 'text-green-600 font-semibold' : ''}>
              {hasFreeShipping ? 'FREE' : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing || !orderId}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate('/cart')}
        className="text-sm text-gray-600 hover:underline"
      >
        Return to cart
      </button>
    </form>
  )
}
