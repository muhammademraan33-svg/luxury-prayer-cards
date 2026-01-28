import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/utils'
import { toast } from 'react-hot-toast'
import type { Order } from '../lib/supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ id?: string; user_metadata?: { user_type?: string } } | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // For this build, make the admin dashboard accessible without requiring login.
  // In a production setup, you can re-enable Supabase auth checks here.
  useEffect(() => {
    setUser({ id: 'local-admin', user_metadata: { user_type: 'admin' } })
  }, [navigate])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user, statusFilter])

  const fetchOrders = async () => {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      toast.success('Order status updated')
      fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order status')
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'payment_failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'pending_payment':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.product_type.toLowerCase().includes(searchTerm.toLowerCase())
      )
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage orders and track fulfillment</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, color: 'blue' },
            {
              label: 'Pending',
              value: orders.filter((o) => o.status === 'pending' || o.status === 'pending_payment').length,
              color: 'yellow',
            },
            {
              label: 'Processing',
              value: orders.filter((o) => o.status === 'processing').length,
              color: 'blue',
            },
            {
              label: 'Shipped',
              value: orders.filter((o) => o.status === 'shipped').length,
              color: 'green',
            },
            {
              label: 'Payment Issues',
              value: orders.filter((o) => o.status === 'payment_failed').length,
              color: 'red',
            },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending (incl. pending payment)</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="payment_failed">Payment Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.order_number}
                        </div>
                        {order.funeral_home_id && (
                          <div className="text-xs text-primary-600">Funeral Home Order</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.length} item(s)
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items.map((item) => item.product_type).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(order.total)}
                        </div>
                        <div className="space-y-0.5">
                          {order.free_shipping && (
                            <div className="text-xs text-green-600">Free Shipping</div>
                          )}
                          {order.payment_status && (
                            <div className="text-xs text-gray-500">
                              Payment: <span className="capitalize">{order.payment_status}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className="text-sm text-gray-900 capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as Order['status'])
                          }
                          className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="pending_payment">Pending Payment</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="payment_failed">Payment Failed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
