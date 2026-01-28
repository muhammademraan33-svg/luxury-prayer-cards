import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Download, ZoomIn, RotateCw, Sun, Type, ShoppingCart, Image as ImageIcon, Square } from 'lucide-react'
import { useCartStore } from '../lib/store'
import { toast } from 'react-hot-toast'
import ReactCrop, { Crop, PixelCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const printSizes = [
  { id: '16x20', name: '16" × 20"', width: 16, height: 20, price: 49.99 },
  { id: '18x24', name: '18" × 24"', width: 18, height: 24, price: 59.99 },
]

export default function MemorialPhotoEditor() {
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [brightness, setBrightness] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [selectedSize, setSelectedSize] = useState(printSizes[0])
  const [textOverlay, setTextOverlay] = useState('')
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 })
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)
  const [logoPosition, setLogoPosition] = useState({ x: 80, y: 80 })
  const [frameStyle, setFrameStyle] = useState<'none' | 'gold' | 'silver' | 'black'>('none')
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setImage(imageUrl)
    }
    reader.readAsDataURL(file)
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
      const logoUrl = event.target?.result as string
      setLogo(logoUrl)
    }
    reader.readAsDataURL(file)
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const crop = makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      selectedSize.width / selectedSize.height,
      width,
      height
    )
    setCrop(crop)
  }

  const handleExportPDF = async () => {
    if (!image || !completedCrop) {
      toast.error('Please upload and crop an image first')
      return
    }

    try {
      // Create canvas for the final image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpi = 300
      canvas.width = selectedSize.width * dpi
      canvas.height = selectedSize.height * dpi

      // Draw image
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = image
      })

      const scaleX = img.naturalWidth / (imgRef.current?.width || 1)
      const scaleY = img.naturalHeight / (imgRef.current?.height || 1)

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(zoom, zoom)

      const brightnessValue = (brightness + 100) / 100
      ctx.filter = `brightness(${brightnessValue})`

      ctx.drawImage(
        img,
        (completedCrop.x * scaleX - canvas.width / 2) / zoom,
        (completedCrop.y * scaleY - canvas.height / 2) / zoom,
        (completedCrop.width * scaleX) / zoom,
        (completedCrop.height * scaleY) / zoom
      )
      ctx.restore()

      // Add text overlay if present
      if (textOverlay) {
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 48px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(
          textOverlay,
          (textPosition.x / 100) * canvas.width,
          (textPosition.y / 100) * canvas.height
        )
      }

      // Add logo if present
      if (logo) {
        const logoImg = new Image()
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve
          logoImg.onerror = reject
          logoImg.src = logo
        })

        const logoTargetWidth = canvas.width * 0.2
        const logoTargetHeight = (logoTargetWidth / logoImg.width) * logoImg.height
        const logoX = (logoPosition.x / 100) * canvas.width - logoTargetWidth / 2
        const logoY = (logoPosition.y / 100) * canvas.height - logoTargetHeight / 2

        ctx.drawImage(logoImg, logoX, logoY, logoTargetWidth, logoTargetHeight)
      }

      // Add frame / border
      if (frameStyle !== 'none') {
        ctx.save()
        const padding = 40
        ctx.lineWidth = 20
        const colorMap: Record<'gold' | 'silver' | 'black', string> = {
          gold: '#c9a34f',
          silver: '#e5e7eb',
          black: '#111827',
        }
        ctx.strokeStyle = colorMap[frameStyle as 'gold' | 'silver' | 'black']
        ctx.strokeRect(padding, padding, canvas.width - padding * 2, canvas.height - padding * 2)
        ctx.restore()
      }

      // Export to PDF
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({
        orientation: selectedSize.width < selectedSize.height ? 'portrait' : 'landscape',
        unit: 'in',
        format: [selectedSize.width, selectedSize.height],
      })

      const imgData = canvas.toDataURL('image/png', 1.0)
      pdf.addImage(imgData, 'PNG', 0, 0, selectedSize.width, selectedSize.height)
      pdf.save(`memorial-photo-${Date.now()}.pdf`)

      toast.success('PDF exported successfully')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Failed to export PDF')
    }
  }

  const handleAddToCart = () => {
    if (!image) {
      toast.error('Please upload an image first')
      return
    }

    const cartItem = {
      id: `photo-print-${Date.now()}`,
      product_type: 'photo_print' as const,
      design_data: {
        image,
        size: selectedSize.id,
        brightness,
        rotation,
        zoom,
        textOverlay,
        textPosition,
        crop: completedCrop,
        logo,
        logoPosition,
        frameStyle,
      },
      quantity: 1,
      price: selectedSize.price,
    }

    addItem(cartItem)
    toast.success('Added to cart')
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Memorial Photo Editor</h1>
          <p className="text-gray-600">Create large-format memorial and celebration of life photo prints</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Editor Canvas */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            {!image ? (
              <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                <Upload className="h-16 w-16 text-gray-400 mb-4" />
                <label className="cursor-pointer">
                  <span className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                    Upload Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="mt-4 text-gray-600">Upload a high-resolution image for best results</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className="relative bg-gray-100 rounded-lg overflow-hidden"
                  style={{
                    borderWidth: frameStyle === 'none' ? 0 : 8,
                    borderStyle: frameStyle === 'none' ? 'none' : 'solid',
                    borderColor:
                      frameStyle === 'gold'
                        ? '#c9a34f'
                        : frameStyle === 'silver'
                        ? '#e5e7eb'
                        : '#111827',
                  }}
                >
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={selectedSize.width / selectedSize.height}
                  >
                    <img
                      ref={imgRef}
                      src={image}
                      alt="Memorial Photo"
                      onLoad={onImageLoad}
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        maxWidth: '100%',
                        height: 'auto',
                      }}
                    />
                  </ReactCrop>
                </div>

                {textOverlay && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${textPosition.x}%`,
                      top: `${textPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {textOverlay}
                  </div>
                )}

                {logo && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${logoPosition.x}%`,
                      top: `${logoPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <img
                      src={logo}
                      alt="Logo"
                      className="h-16 w-auto object-contain drop-shadow-md"
                    />
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Size Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Print Size</h2>
              <div className="space-y-2">
                {printSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition ${
                      selectedSize.id === size.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold">{size.name}</div>
                    <div className="text-sm text-gray-600">${size.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Border / Frame Options */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Square className="h-5 w-5 text-gray-700" />
                Frame / Border
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {['none', 'gold', 'silver', 'black'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setFrameStyle(style as typeof frameStyle)}
                    className={`p-3 border-2 rounded-lg text-sm capitalize transition ${
                      frameStyle === style
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {style === 'none' ? 'No Frame' : `${style} frame`}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Controls */}
            {image && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">Image Adjustments</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center space-x-2 mb-2">
                        <ZoomIn className="h-5 w-5" />
                        <span>Zoom: {Math.round(zoom * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 mb-2">
                        <RotateCw className="h-5 w-5" />
                        <span>Rotation: {rotation}°</span>
                      </label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 mb-2">
                        <Sun className="h-5 w-5" />
                        <span>Brightness: {brightness}</span>
                      </label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Text Overlay */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Text Overlay</h2>
                    <button
                      onClick={() => setShowTextEditor(!showTextEditor)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Type className="h-5 w-5" />
                    </button>
                  </div>
                  {showTextEditor && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={textOverlay}
                        onChange={(e) => setTextOverlay(e.target.value)}
                        placeholder="Enter text..."
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <div>
                        <label className="block text-sm mb-2">Position X: {textPosition.x}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={textPosition.x}
                          onChange={(e) =>
                            setTextPosition({ ...textPosition, x: parseInt(e.target.value) })
                          }
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Position Y: {textPosition.y}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={textPosition.y}
                          onChange={(e) =>
                            setTextPosition({ ...textPosition, y: parseInt(e.target.value) })
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Logo Upload */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Logo / Seal
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Upload funeral home logo, church seal, or emblem.
                      </div>
                      <label className="cursor-pointer px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {logo && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Position</span>
                          <button
                            type="button"
                            onClick={() => setLogo(null)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove logo
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Horizontal: {logoPosition.x}%</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={logoPosition.x}
                            onChange={(e) =>
                              setLogoPosition({ ...logoPosition, x: parseInt(e.target.value) })
                            }
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Vertical: {logoPosition.y}%</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={logoPosition.y}
                            onChange={(e) =>
                              setLogoPosition({ ...logoPosition, y: parseInt(e.target.value) })
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="space-y-3">
                    <button
                      onClick={handleExportPDF}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Download className="h-5 w-5" />
                      <span>Export PDF</span>
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart - ${selectedSize.price}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
