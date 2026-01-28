import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Upload, Package, CheckCircle, PhoneCall, LogIn, UserPlus } from 'lucide-react'
import { supabase, type Order } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import { useCartStore } from '../lib/store'
import { formatPrice } from '../lib/utils'

export default function FuneralHomePortal() {
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)

  const [user, setUser] = useState<{ id?: string; email?: string; user_metadata?: { user_type?: string } } | null>(null)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.user_metadata?.user_type === 'funeral_home') {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata as { user_type?: string },
        })
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.user_metadata?.user_type === 'funeral_home') {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata as { user_type?: string },
        })
      } else {
        setUser(null)
      }
    })
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return
      setOrdersLoading(true)
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('funeral_home_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setOrders((data as Order[]) || [])
      } catch (error) {
        console.error('Error loading funeral home orders:', error)
        toast.error('Failed to load your orders')
      } finally {
        setOrdersLoading(false)
      }
    }

    if (user?.id) {
      fetchOrders()
    }
  }, [user])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user?.user_metadata?.user_type !== 'funeral_home') {
        await supabase.auth.signOut()
        toast.error('This account is not a Funeral Home account')
        return
      }

      toast.success('Logged in as funeral home')
      setUser(data.user)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: 'funeral_home',
            name,
          },
        },
      })

      if (error) throw error

      toast.success('Funeral home account created. Please verify via email.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    toast.success('Logged out')
  }

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) return

    order.items.forEach((item) => {
      addItem({
        id: `reorder-${order.id}-${item.id}-${Date.now()}`,
        product_type: item.product_type,
        design_data: item.design_data,
        quantity: item.quantity,
        price: item.price,
      })
    })

    toast.success('Items added to cart from previous order')
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-10 w-10 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Funeral Home Portal</h1>
            </div>
            <p className="text-gray-600 text-lg mb-4 max-w-xl">
              Partner with Luxury Prayer Cards for fast, premium memorial cards—
              <span className="font-semibold text-primary-700"> with automatic free shipping on every order.</span>
            </p>
            <p className="text-gray-700 mb-4">
              <strong>No login or signup required for free shipping.</strong> Simply check the
              <span className="font-semibold"> “Funeral Home”</span> box at checkout and free shipping is applied
              automatically.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Optional: create a funeral home account below to track orders, re‑order designs, and manage
              multiple services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/design')}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Start a Design for a Family
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="px-8 py-3 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition font-semibold"
              >
                Go to Checkout
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 bg-primary-50 border border-primary-100 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-3 text-primary-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              How Free Shipping Works
            </h2>
            <ol className="space-y-2 text-sm text-gray-800 list-decimal list-inside">
              <li>Design cards for the family using the online designer.</li>
              <li>Add the order to your cart.</li>
              <li>At checkout, check the “This is a funeral home order” box.</li>
              <li>Free shipping is applied automatically—no code or login needed.</li>
            </ol>
            <p className="mt-3 text-xs text-gray-600">
              The checkbox is available on the checkout page for both logged-in and guest users.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Automatic Free Shipping</h3>
              <Package className="h-7 w-7 text-primary-600" />
            </div>
            <p className="text-sm text-gray-700">
              Check the funeral home box at checkout and shipping is waived on every order—no account or
              coupon code required.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Upload Once, Reuse Anytime</h3>
              <Upload className="h-7 w-7 text-primary-600" />
            </div>
            <p className="text-sm text-gray-700">
              Upload the family’s photo and information, customize the card, and quickly reorder matching
              designs for additional services.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Priority Support</h3>
              <PhoneCall className="h-7 w-7 text-primary-600" />
            </div>
            <p className="text-sm text-gray-700">
              Working on tight timelines? Our team prioritizes funeral home partners for rush orders and
              last‑minute changes.
            </p>
          </div>
        </div>

        {/* Optional account login / registration */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-md p-6 max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Funeral Home Account (Optional)</h2>
              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-primary-700 hover:underline"
                >
                  Logout
                </button>
              )}
            </div>
            {user ? (
              <p className="text-sm text-gray-700 mb-4">
                Logged in as <span className="font-semibold">{user.email}</span>. All orders placed while
                logged in will be linked to your funeral home for tracking and easy re‑orders. Free shipping
                is applied automatically.
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-700 mb-4">
                  Create an optional funeral home account to see your past orders and quickly re‑order matching
                  designs. Free shipping still works without an account.
                </p>

                <div className="flex mb-4 border-b">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 text-center font-medium transition ${
                      isLogin
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LogIn className="h-4 w-4 inline mr-1" />
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 text-center font-medium transition ${
                      !isLogin
                        ? 'border-b-2 border-primary-600 text-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <UserPlus className="h-4 w-4 inline mr-1" />
                    Register
                  </button>
                </div>

                {isLogin ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Funeral Home Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Creating account...' : 'Register'}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Orders for logged-in funeral homes */}
          {user && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
              </div>
              {ordersLoading ? (
                <p className="text-sm text-gray-600">Loading orders…</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No funeral home orders yet. Place your first order to see it appear here.
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-auto pr-1">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2 text-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">#{order.order_number}</span>
                        <span className="capitalize text-gray-700">{order.status}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{order.items.length} item(s)</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-semibold text-primary-700">
                          {formatPrice(order.total)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 transition"
                          >
                            Re-order
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/order-confirmation/${order.id}`)}
                            className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
