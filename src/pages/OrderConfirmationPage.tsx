import { useEffect, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Download, Home } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/utils'
import type { Order } from '../lib/supabase'

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (error) throw error
        setOrder(data)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  // If Stripe redirected back with a payment_intent_client_secret, we can clear the cart safely.
  useEffect(() => {
    const piSecret = searchParams.get('payment_intent_client_secret')
    if (piSecret) {
      // Cart is stored in zustand persist; clearing here avoids stale items after redirect.
      try {
        const raw = localStorage.getItem('cart-storage')
        if (raw) {
          const parsed = JSON.parse(raw)
          parsed.state.items = []
          localStorage.setItem('cart-storage', JSON.stringify(parsed))
        }
      } catch {
        // ignore
      }
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <Link to="/" className="text-primary-600 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We've received your payment and will begin processing your
            order shortly.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-semibold">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold capitalize">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-semibold">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-bold mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {item.product_type === 'card' ? 'Prayer Card' : 'Photo Print'}
                    </p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Download className="h-5 w-5 mr-2" />
              Download Receipt
            </button>
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <Home className="h-5 w-5 mr-2" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
