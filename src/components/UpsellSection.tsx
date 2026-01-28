import { useState } from 'react'
import { X, Image as ImageIcon, Sparkles, Layers } from 'lucide-react'
import { useCartStore, type CartItem } from '../lib/store'
import { formatPrice } from '../lib/utils'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'

interface UpsellSectionProps {
  cartItem: CartItem
  onUpdate: (updatedItem: CartItem) => void
}

export default function UpsellSection({ cartItem, onUpdate }: UpsellSectionProps) {
  const [showUpsells, setShowUpsells] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  if (cartItem.product_type !== 'card') {
    return null
  }

  const designData = cartItem.design_data as any

  const handleSizeUpgrade = () => {
    if (designData.cardSize === 'large') {
      toast.error('Already upgraded to large size')
      return
    }

    const updatedData = { ...designData, cardSize: 'large' as const }
    const sizeUpgradePrice = 7
    const newPrice = cartItem.price + sizeUpgradePrice

    onUpdate({
      ...cartItem,
      design_data: updatedData,
      price: newPrice,
    })
    toast.success('Upgraded to large size (+$7)')
  }

  const handlePremiumThickness = () => {
    if (designData.premiumThickness) {
      // Remove premium thickness
      const updatedData = { ...designData, premiumThickness: false }
      const newPrice = cartItem.price - 5

      onUpdate({
        ...cartItem,
        design_data: updatedData,
        price: Math.max(0, newPrice),
      })
      toast.success('Premium thickness removed')
    } else {
      // Add premium thickness
      const updatedData = { ...designData, premiumThickness: true }
      const newPrice = cartItem.price + 5

      onUpdate({
        ...cartItem,
        design_data: updatedData,
        price: newPrice,
      })
      toast.success('Premium thickness added (+$5)')
    }
  }

  const handleExtraDesign = () => {
    const currentExtras = designData.extraDesigns || 0
    const updatedData = { ...designData, extraDesigns: currentExtras + 1 }
    const newPrice = cartItem.price + 10

    onUpdate({
      ...cartItem,
      design_data: updatedData,
      price: newPrice,
    })
    toast.success('Extra design added (+$10)')
  }

  const handleRemoveExtraDesign = () => {
    const currentExtras = designData.extraDesigns || 0
    if (currentExtras <= 0) return

    const updatedData = { ...designData, extraDesigns: currentExtras - 1 }
    const newPrice = cartItem.price - 10

    onUpdate({
      ...cartItem,
      design_data: updatedData,
      price: Math.max(0, newPrice),
    })
    toast.success('Extra design removed')
  }

  const handleAddMemorialPhoto = (size: '16x20' | '18x24') => {
    const photoPrice = size === '16x20' ? 45 : 55
    const memorialItem: CartItem = {
      id: `memorial-${Date.now()}`,
      product_type: 'photo_print',
      design_data: {
        size,
        type: 'memorial',
      },
      quantity: 1,
      price: photoPrice,
    }

    addItem(memorialItem)
    toast.success(`Memorial photo print (${size}") added to cart`)
  }

  const hasSizeUpgrade = designData.cardSize === 'large'
  const hasPremiumThickness = designData.premiumThickness || false
  const extraDesignsCount = designData.extraDesigns || 0

  if (!showUpsells) {
    return (
      <button
        onClick={() => setShowUpsells(true)}
        className="w-full mt-4 px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white hover:bg-navy-700 transition text-sm"
      >
        Show Add-Ons & Upsells
      </button>
    )
  }

  return (
    <div className="mt-4 bg-navy-800 rounded-lg p-4 border border-navy-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold-500" />
          Enhance Your Order
        </h3>
        <button
          onClick={() => setShowUpsells(false)}
          className="text-gray-400 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Size Upgrade */}
        {!hasSizeUpgrade && (
          <div className="bg-navy-900 rounded-lg p-4 border border-navy-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">Upgrade to Large Size</h4>
                <p className="text-sm text-gray-400 mb-2">
                  Increase from 2.5"×4.25" to 3"×4.75" for more space
                </p>
                <div className="text-gold-500 font-semibold">+{formatPrice(7)}</div>
              </div>
              <button
                onClick={handleSizeUpgrade}
                className="ml-4 px-4 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 transition font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Premium Thickness */}
        <div className="bg-navy-900 rounded-lg p-4 border border-navy-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
                <Layers className="h-4 w-4 text-gold-500" />
                Premium Thickness
              </h4>
              <p className="text-sm text-gray-400 mb-2">
                Extra thick cardstock for a premium feel
              </p>
              <div className="text-gold-500 font-semibold">
                {hasPremiumThickness ? 'Added' : `+${formatPrice(5)}`}
              </div>
            </div>
            <button
              onClick={handlePremiumThickness}
              className={`ml-4 px-4 py-2 rounded-lg transition font-semibold ${
                hasPremiumThickness
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gold-500 text-navy-900 hover:bg-gold-400'
              }`}
            >
              {hasPremiumThickness ? 'Remove' : 'Add'}
            </button>
          </div>
        </div>

        {/* Extra Designs */}
        <div className="bg-navy-900 rounded-lg p-4 border border-navy-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">Extra Designs</h4>
              <p className="text-sm text-gray-400 mb-2">
                Order additional card designs with different photos or layouts
              </p>
              <div className="flex items-center gap-2">
                {extraDesignsCount > 0 && (
                  <button
                    onClick={handleRemoveExtraDesign}
                    className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                  >
                    -
                  </button>
                )}
                <span className="text-gold-500 font-semibold">
                  {extraDesignsCount > 0 ? `${extraDesignsCount} added` : `+${formatPrice(10)} each`}
                </span>
                <button
                  onClick={handleExtraDesign}
                  className="px-2 py-1 bg-gold-500 text-navy-900 rounded text-sm hover:bg-gold-400 transition font-semibold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Memorial Photo Prints */}
        <div className="bg-navy-900 rounded-lg p-4 border border-navy-700">
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-gold-500" />
              Memorial Photo Prints
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Add a large-format memorial photo print to your order
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddMemorialPhoto('16x20')}
                className="px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white hover:border-gold-500 transition text-sm"
              >
                <div className="font-semibold">16" × 20"</div>
                <div className="text-xs text-gold-500">{formatPrice(45)}</div>
              </button>
              <button
                onClick={() => handleAddMemorialPhoto('18x24')}
                className="px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white hover:border-gold-500 transition text-sm"
              >
                <div className="font-semibold">18" × 24"</div>
                <div className="text-xs text-gold-500">{formatPrice(55)}</div>
              </button>
            </div>
            <Link
              to="/memorial-photo-editor"
              className="block mt-2 text-center text-sm text-gold-500 hover:text-gold-400 transition"
            >
              Or design custom memorial photo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
