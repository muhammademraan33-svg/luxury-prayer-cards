import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../lib/store'
import { formatPrice } from '../lib/utils'
import { toast } from 'react-hot-toast'
import UpsellSection from '../components/UpsellSection'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const updateItem = useCartStore((state) => state.updateItem)
  const getTotal = useCartStore((state) => state.getTotal)

  const subtotal = getTotal()
  const shipping = subtotal > 0 ? 5.99 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleRemove = (id: string) => {
    removeItem(id)
    toast.success('Item removed from cart')
  }

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) {
      handleRemove(id)
      return
    }
    updateQuantity(id, quantity)
  }

  const handleItemUpdate = (item: typeof items[0]) => {
    updateItem(item.id, item)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-navy-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-800 rounded-lg shadow-lg p-12 text-center border border-navy-700">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-white">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Start designing your prayer card to get started</p>
            <Link
              to="/design"
              className="inline-flex items-center px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 transition font-semibold"
            >
              Start Designing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const designData = item.design_data as any
              const hasAddOns =
                designData?.premiumThickness ||
                designData?.extraDesigns > 0 ||
                designData?.cardSize === 'large'

              return (
                <div key={item.id} className="bg-navy-800 rounded-lg shadow-md p-6 border border-navy-700">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className="w-32 h-48 rounded-lg flex items-center justify-center text-4xl"
                        style={{
                          background:
                            item.product_type === 'card'
                              ? designData?.cardType === 'metal'
                                ? 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%)'
                                : 'linear-gradient(to bottom, #e3f2fd, #bbdefb)'
                              : 'linear-gradient(to bottom, #f3e5f5, #e1bee7)',
                        }}
                      >
                        {item.product_type === 'card' ? '📄' : '🖼️'}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2 text-white">
                        {item.product_type === 'card'
                          ? `${designData?.cardType?.charAt(0).toUpperCase() + designData?.cardType?.slice(1)} Prayer Card`
                          : `Memorial Photo Print ${designData?.size || ''}`}
                      </h3>
                      <div className="text-gray-400 mb-2">
                        {item.product_type === 'card' && (
                          <div className="space-y-1">
                            <div>
                              Size: <span className="text-white capitalize">{designData?.cardSize || 'standard'}</span>
                              {designData?.cardSize === 'large' && (
                                <span className="text-gold-500 text-sm ml-2">(+$7)</span>
                              )}
                            </div>
                            <div>
                              Border: <span className="text-white capitalize">{designData?.borderStyle || 'classic'}</span>{' '}
                              <span className="text-white capitalize">({designData?.borderColor || 'gold'})</span>
                            </div>
                            {hasAddOns && (
                              <div className="mt-2 pt-2 border-t border-navy-700">
                                <div className="text-sm text-gold-500 font-semibold">Add-ons:</div>
                                {designData?.premiumThickness && (
                                  <div className="text-xs text-gray-300">✓ Premium Thickness (+$5)</div>
                                )}
                                {designData?.extraDesigns > 0 && (
                                  <div className="text-xs text-gray-300">
                                    ✓ {designData.extraDesigns} Extra Design{designData.extraDesigns > 1 ? 's' : ''} (+${designData.extraDesigns * 10})
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {item.product_type === 'photo_print' && (
                          <div>
                            Size: <span className="text-white">{designData?.size || 'N/A'}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-2 rounded hover:bg-navy-700 transition border border-navy-600"
                          >
                            <Minus className="h-5 w-5 text-white" />
                          </button>
                          <span className="w-12 text-center font-medium text-white">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-2 rounded hover:bg-navy-700 transition border border-navy-600"
                          >
                            <Plus className="h-5 w-5 text-white" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-semibold text-gold-500">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-2 text-red-400 hover:bg-red-900/20 rounded transition"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Upsell Section for Card Items */}
                      {item.product_type === 'card' && (
                        <UpsellSection cartItem={item} onUpdate={handleItemUpdate} />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-navy-800 rounded-lg shadow-md p-6 sticky top-8 border border-navy-700">
              <h2 className="text-xl font-bold mb-4 text-white">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span className="text-white">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-navy-700 pt-3 flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-gold-500">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full text-center px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 transition font-semibold"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/design"
                className="block w-full text-center px-6 py-3 mt-3 border border-navy-700 rounded-lg hover:bg-navy-700 transition text-white"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
