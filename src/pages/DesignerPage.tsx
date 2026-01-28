import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Zap, ChevronRight, ChevronLeft, Upload, QrCode, Image as ImageIcon, X, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import CardPreview from '../components/Designer/CardPreview'
import PhotoEditor from '../components/Designer/PhotoEditor'
import BorderSelector from '../components/Designer/BorderSelector'
import PrayerSelector from '../components/Designer/PrayerSelector'
import { useCartStore } from '../lib/store'
import { generateQRCode } from '../lib/qrcode'
import { exportToPDF } from '../lib/pdfExport'
import type { DesignData } from '../types/design'

const fonts = [
  { id: 'serif', name: 'Great Vibes', family: 'Great Vibes, cursive' },
  { id: 'script', name: 'Dancing Script', family: 'Dancing Script, cursive' },
  { id: 'sans', name: 'Cormorant', family: 'Cormorant, serif' },
  { id: 'elegant', name: 'Playfair Display', family: 'Playfair Display, serif' },
]

const stickers = [
  { emoji: '🕊️', name: 'Dove' },
  { emoji: '🌹', name: 'Rose' },
  { emoji: '⭐', name: 'Star' },
  { emoji: '💫', name: 'Sparkle' },
  { emoji: '✨', name: 'Shine' },
  { emoji: '❤️', name: 'Heart' },
  { emoji: '🙏', name: 'Prayer' },
  { emoji: '🕯️', name: 'Candle' },
  { emoji: '🌿', name: 'Leaf' },
  { emoji: '🌸', name: 'Flower' },
  { emoji: '🦋', name: 'Butterfly' },
  { emoji: '☁️', name: 'Cloud' },
]

type Step = 1 | 2 | 3 | 4 | 5 | 6

const stepNames = {
  1: 'Card Type & Size',
  2: 'Border Style',
  3: 'Content & Text',
  4: 'Photo',
  5: 'Extras',
  6: 'Review',
}

export default function DesignerPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const addItem = useCartStore((state) => state.addItem)
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [view, setView] = useState<'front' | 'back'>('front')
  const [showPhotoEditor, setShowPhotoEditor] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(55)
  const [showQRGenerator, setShowQRGenerator] = useState(false)
  const [qrUrl, setQrUrl] = useState('')
  const [designData, setDesignData] = useState<DesignData>({
    cardType: (searchParams.get('type') as 'paper' | 'metal') || 'paper',
    cardSize: 'standard',
    borderStyle: 'classic',
    borderColor: 'gold',
    font: 'serif',
    textColor: '#000000',
    roundedCorners: false,
    quantity: 55,
  })

  useEffect(() => {
    const qty = parseInt(searchParams.get('quantity') || '55')
    setQuantity(qty)
    setDesignData((prev) => ({ ...prev, quantity: qty }))
  }, [searchParams])

  useEffect(() => {
    const saved = localStorage.getItem('current-design')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setDesignData(parsed)
        setQuantity(parsed.quantity || 55)
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  useEffect(() => {
    try {
      // Avoid storing large binary data URLs in localStorage to prevent quota errors
      const { photo, frontPhoto, funeralHomeLogo, qrCode, ...rest } = designData
      const safeDesign = { ...rest, quantity }
      localStorage.setItem('current-design', JSON.stringify(safeDesign))
    } catch (error) {
      // If quota is exceeded or storage is unavailable, fail silently for now
      console.error('Failed to persist design to localStorage:', error)
    }
  }, [designData, quantity])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setEditingPhoto(imageUrl)
      setShowPhotoEditor(true)
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoSave = (editedImage: string, crop: { width: number; height: number; x: number; y: number }, brightness: number) => {
    setDesignData({
      ...designData,
      frontPhoto: editedImage,
      photo: editedImage,
      photoBrightness: brightness,
      frontPhotoWidth: crop.width,
      frontPhotoHeight: crop.height,
      frontPhotoX: crop.x,
      frontPhotoY: crop.y,
    })
    setShowPhotoEditor(false)
    setEditingPhoto(null)
    toast.success('Photo updated')
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setDesignData({
        ...designData,
        funeralHomeLogo: imageUrl,
        logoX: 20,
        logoY: 20,
      })
      toast.success('Logo uploaded')
    }
    reader.readAsDataURL(file)
  }

  const handleGenerateQR = async () => {
    if (!qrUrl.trim()) {
      toast.error('Please enter a URL')
      return
    }

    try {
      const qrCodeDataUrl = await generateQRCode(qrUrl)
      setDesignData({
        ...designData,
        qrCode: qrCodeDataUrl,
        qrX: 0,
        qrY: 0,
      })
      setShowQRGenerator(false)
      setQrUrl('')
      toast.success('QR code generated')
    } catch (error) {
      toast.error('Failed to generate QR code')
    }
  }

  const handleAddSticker = (sticker: { emoji: string; name: string }) => {
    const newStickers = [...(designData.stickers || [])]
    const cardWidth = designData.cardSize === 'standard' ? 300 : 360
    const cardHeight = designData.cardSize === 'standard' ? 510 : 570
    newStickers.push({
      emoji: sticker.emoji,
      x: cardWidth / 2,
      y: cardHeight / 2,
    })
    setDesignData({ ...designData, stickers: newStickers })
    toast.success('Sticker added')
  }

  const handleExportPrintPDF = async () => {
    try {
      await exportToPDF(designData)
      toast.success('Print-ready PDF downloaded')
    } catch (error) {
      console.error(error)
      toast.error('Failed to export PDF')
    }
  }

  const handleAddToCart = () => {
    const basePrice = designData.cardType === 'metal' ? 1.76 : 1.22
    const sizeUpgrade = designData.cardSize === 'large' ? 7 : 0
    const premiumThickness = designData.premiumThickness ? 5 : 0
    const extraDesigns = (designData.extraDesigns || 0) * 10
    const totalPrice = basePrice * quantity + sizeUpgrade + premiumThickness + extraDesigns

    const cartItem = {
      id: `design-${Date.now()}`,
      product_type: 'card' as const,
      design_data: { ...designData, quantity },
      quantity: quantity,
      price: totalPrice,
    }

    addItem(cartItem)
    toast.success('Added to cart')
    navigate('/cart')
  }

  const calculatePrice = () => {
    const basePrice = designData.cardType === 'metal' ? 1.76 : 1.22
    const sizeUpgrade = designData.cardSize === 'large' ? 7 : 0
    const premiumThickness = designData.premiumThickness ? 5 : 0
    const extraDesigns = (designData.extraDesigns || 0) * 10
    return basePrice * quantity + sizeUpgrade + premiumThickness + extraDesigns
  }

  const pricePerCard = calculatePrice() / quantity

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return !!designData.borderStyle && !!designData.borderColor
      case 3:
        return view === 'back' || !!designData.frontName
      case 4:
        return true // Photo is optional
      case 5:
        return true
      case 6:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 6 && canGoNext()) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Card Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDesignData({ ...designData, cardType: 'paper' })}
                  className={`p-6 rounded-lg border-2 transition ${
                    designData.cardType === 'paper'
                      ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                      : 'border-gray-600 bg-navy-800 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl font-bold mb-2">PAPER CARDS</div>
                  <div className="text-sm">Classic glossy cardstock</div>
                  <div className="text-lg font-semibold mt-2">$1.22/card</div>
                </button>
                <button
                  onClick={() => setDesignData({ ...designData, cardType: 'metal' })}
                  className={`p-6 rounded-lg border-2 transition ${
                    designData.cardType === 'metal'
                      ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                      : 'border-gray-600 bg-navy-800 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl font-bold mb-2">METAL CARDS</div>
                  <div className="text-sm">Premium metal finish</div>
                  <div className="text-lg font-semibold mt-2">$1.76/card</div>
                </button>
              </div>
            </div>

            {designData.cardType === 'metal' && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-white">Metal Background</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['brushed', 'marble', 'solid'].map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setDesignData({ ...designData, background: bg as DesignData['background'] })}
                      className={`p-4 rounded-lg border-2 transition capitalize ${
                        designData.background === bg
                          ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                          : 'border-gray-600 bg-navy-800 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {designData.cardType === 'metal' && (
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={designData.roundedCorners || false}
                    onChange={(e) => setDesignData({ ...designData, roundedCorners: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-white">Rounded Corners</span>
                </label>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <BorderSelector designData={designData} onUpdate={(data) => setDesignData({ ...designData, ...data })} />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setView('front')}
                className={`px-4 py-2 rounded border-2 transition ${
                  view === 'front'
                    ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                    : 'border-gray-600 bg-navy-800 text-gray-300'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setView('back')}
                className={`px-4 py-2 rounded border-2 transition ${
                  view === 'back'
                    ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                    : 'border-gray-600 bg-navy-800 text-gray-300'
                }`}
              >
                Back
              </button>
            </div>

            {view === 'front' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-white">Name</h3>
                  <input
                    type="text"
                    value={designData.frontName || ''}
                    onChange={(e) =>
                      setDesignData({
                        ...designData,
                        frontName: e.target.value,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter name"
                    className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-white">Dates</h3>
                  <input
                    type="text"
                    value={designData.frontDates || ''}
                    onChange={(e) =>
                      setDesignData({
                        ...designData,
                        frontDates: e.target.value,
                        dates: e.target.value,
                      })
                    }
                    placeholder="January 1, 1945 - December 31, 2025"
                    className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-white">Font</h3>
                  <select
                    value={designData.font || 'serif'}
                    onChange={(e) => setDesignData({ ...designData, font: e.target.value })}
                    className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white"
                  >
                    {fonts.map((font) => (
                      <option key={font.id} value={font.id}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <PrayerSelector designData={designData} onUpdate={(data) => setDesignData({ ...designData, ...data })} />
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Upload Photo</h3>
              <label className="block">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gold-500 transition">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <div className="text-white font-semibold mb-2">Click to upload photo</div>
                  <div className="text-sm text-gray-400">JPG, PNG up to 10MB</div>
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            {designData.frontPhoto && (
              <div className="bg-navy-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">Photo uploaded</span>
                  <button
                    onClick={() => {
                      setDesignData({
                        ...designData,
                        frontPhoto: undefined,
                        photo: undefined,
                      })
                      toast.success('Photo removed')
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <img src={designData.frontPhoto} alt="Preview" className="w-full h-48 object-cover rounded" />
              </div>
            )}

            <div className="bg-navy-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-white">Order Large-Format Print</h3>
              <p className="text-sm text-gray-400 mb-4">Add a memorial photo print to your order</p>
              <button
                onClick={() => navigate('/memorial-photo-editor')}
                className="w-full px-4 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 transition font-semibold"
              >
                Design Memorial Photo Print
              </button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">QR Code</h3>
              {designData.qrCode ? (
                <div className="bg-navy-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">QR Code added</span>
                    <button
                      onClick={() => {
                        setDesignData({ ...designData, qrCode: undefined })
                        toast.success('QR code removed')
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <img src={designData.qrCode} alt="QR Code" className="w-32 h-32 mx-auto" />
                </div>
              ) : (
                <button
                  onClick={() => setShowQRGenerator(true)}
                  className="w-full px-4 py-3 bg-navy-800 border-2 border-dashed border-gray-600 rounded-lg hover:border-gold-500 transition flex items-center justify-center gap-2 text-white"
                >
                  <QrCode className="h-5 w-5" />
                  <span>Generate QR Code</span>
                </button>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Funeral Home Logo</h3>
              {designData.funeralHomeLogo ? (
                <div className="bg-navy-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Logo uploaded</span>
                    <button
                      onClick={() => {
                        setDesignData({ ...designData, funeralHomeLogo: undefined })
                        toast.success('Logo removed')
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <img src={designData.funeralHomeLogo} alt="Logo" className="h-20 mx-auto" />
                </div>
              ) : (
                <label className="block">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gold-500 transition">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <div className="text-white font-semibold mb-2">Upload Logo</div>
                    <div className="text-sm text-gray-400">PNG, SVG up to 5MB</div>
                  </div>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Stickers & Icons</h3>
              <div className="grid grid-cols-6 gap-2">
                {stickers.map((sticker) => (
                  <button
                    key={sticker.emoji}
                    onClick={() => handleAddSticker(sticker)}
                    className="p-4 bg-navy-800 border border-navy-700 rounded-lg hover:border-gold-500 transition text-2xl"
                    title={sticker.name}
                  >
                    {sticker.emoji}
                  </button>
                ))}
              </div>
              {designData.stickers && designData.stickers.length > 0 && (
                <div className="mt-4 text-sm text-gray-400">
                  {designData.stickers.length} sticker(s) added. Drag to position on card.
                </div>
              )}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-navy-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-white">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Card Type</span>
                  <span className="text-white font-semibold capitalize">{designData.cardType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size</span>
                  <span className="text-white font-semibold">
                    {designData.cardSize === 'standard' ? '2.5" × 4.25"' : '3" × 4.75"'}
                    {designData.cardSize === 'large' && (
                      <span className="text-gold-500 text-sm ml-2">(+$7)</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Border</span>
                  <span className="text-white font-semibold capitalize">
                    {designData.borderStyle} ({designData.borderColor})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantity</span>
                  <span className="text-white font-semibold">{quantity}</span>
                </div>
                <div className="border-t border-navy-700 pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-gold-500 font-bold text-2xl">${calculatePrice().toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">${pricePerCard.toFixed(2)} per card</div>
                </div>
              </div>
            </div>

            {/* Print-ready PDF export */}
            <div className="bg-navy-800 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-navy-700">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Print-Ready PDF</h3>
                <p className="text-sm text-gray-400">
                  Download a 300 DPI PDF with bleed and crop marks for professional printing.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportPrintPDF}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-navy-700 text-white rounded-lg border border-navy-500 hover:bg-navy-600 transition text-sm font-semibold"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Print-Ready PDF
              </button>
            </div>

            {/* Quick Add-Ons */}
            <div className="bg-navy-800 rounded-lg p-6 border border-navy-700">
              <h3 className="text-lg font-semibold mb-4 text-white">Add Premium Options</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-navy-900 rounded-lg border border-navy-700 cursor-pointer hover:border-gold-500 transition">
                  <div>
                    <div className="font-semibold text-white">Premium Thickness</div>
                    <div className="text-sm text-gray-400">Extra thick cardstock for a premium feel</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gold-500 font-semibold">+$5</span>
                    <input
                      type="checkbox"
                      checked={designData.premiumThickness || false}
                      onChange={(e) =>
                        setDesignData({ ...designData, premiumThickness: e.target.checked })
                      }
                      className="w-5 h-5 rounded"
                    />
                  </div>
                </label>

                <div className="p-3 bg-navy-900 rounded-lg border border-navy-700">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-white">Extra Designs</div>
                      <div className="text-sm text-gray-400">Order additional card designs</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const current = designData.extraDesigns || 0
                          if (current > 0) {
                            setDesignData({ ...designData, extraDesigns: current - 1 })
                          }
                        }}
                        disabled={(designData.extraDesigns || 0) === 0}
                        className="px-3 py-1 bg-navy-700 border border-navy-600 rounded disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-navy-600 transition"
                      >
                        -
                      </button>
                      <span className="text-white font-semibold w-8 text-center">
                        {designData.extraDesigns || 0}
                      </span>
                      <button
                        onClick={() => {
                          const current = designData.extraDesigns || 0
                          setDesignData({ ...designData, extraDesigns: current + 1 })
                        }}
                        className="px-3 py-1 bg-gold-500 text-navy-900 rounded hover:bg-gold-400 transition font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {(designData.extraDesigns || 0) > 0 && (
                    <div className="text-sm text-gold-500">
                      +${((designData.extraDesigns || 0) * 10).toFixed(2)} ({designData.extraDesigns} × $10)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Header */}
      <div className="bg-navy-800 border-b border-navy-700 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">LuxuryPrayerCards.com</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gold-500/20 border border-gold-500 rounded text-gold-500 text-sm">
              <Zap className="h-4 w-4" />
              <span>48-72 Hour Delivery</span>
            </button>
            <div className="text-sm text-gray-400">
              Step {currentStep} of 6: {stepNames[currentStep]}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-navy-800 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded ${
                  step <= currentStep ? 'bg-gold-500' : 'bg-navy-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Card Preview */}
          <div className="lg:col-span-1">
            <CardPreview
              designData={designData}
              onUpdate={(data) => setDesignData({ ...designData, ...data })}
              onPhotoUpload={handlePhotoUpload}
              view={view}
              onViewChange={setView}
            />
          </div>

          {/* Right Panel - Step Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{stepNames[currentStep]}</h2>
              <p className="text-gray-400">Customize your card design</p>
            </div>

            <div className="bg-navy-800 rounded-lg p-6 border border-navy-700 min-h-[400px]">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                  currentStep === 1
                    ? 'bg-navy-800 text-gray-500 cursor-not-allowed'
                    : 'bg-navy-800 border border-navy-700 text-white hover:bg-navy-700'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>
              <button
                onClick={currentStep === 6 ? handleAddToCart : handleNext}
                disabled={!canGoNext()}
                className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                  canGoNext()
                    ? 'bg-gold-500 text-navy-900 hover:bg-gold-400'
                    : 'bg-navy-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentStep === 6 ? 'Add to Cart' : 'Next'}
                {currentStep !== 6 && <ChevronRight className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Editor Modal */}
      {showPhotoEditor && editingPhoto && (
        <PhotoEditor
          image={editingPhoto}
          onSave={handlePhotoSave}
          onClose={() => {
            setShowPhotoEditor(false)
            setEditingPhoto(null)
          }}
        />
      )}

      {/* QR Code Generator Modal */}
      {showQRGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-800 rounded-lg max-w-md w-full p-6 border border-navy-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Generate QR Code</h2>
              <button
                onClick={() => {
                  setShowQRGenerator(false)
                  setQrUrl('')
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                <input
                  type="url"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  placeholder="https://example.com/memorial"
                  className="w-full px-4 py-3 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-gray-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowQRGenerator(false)
                    setQrUrl('')
                  }}
                  className="flex-1 px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white hover:bg-navy-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateQR}
                  className="flex-1 px-4 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 transition font-semibold"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
