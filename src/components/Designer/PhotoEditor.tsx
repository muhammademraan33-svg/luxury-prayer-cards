import { useState, useRef } from 'react'
import { ZoomIn, RotateCw, Sun, X, Move } from 'lucide-react'
import ReactCrop, { Crop, PixelCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface PhotoEditorProps {
  image: string
  onSave: (editedImage: string, crop: { width: number; height: number; x: number; y: number }, brightness: number) => void
  onClose: () => void
}

export default function PhotoEditor({ image, onSave, onClose }: PhotoEditorProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [brightness, setBrightness] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const crop = makeAspectCrop(
      {
        unit: '%',
        width: 80,
      },
      1,
      width,
      height
    )
    setCrop(crop)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setBrightness(0)
    setPan({ x: 0, y: 0 })
    setCrop(undefined)
    setCompletedCrop(undefined)
  }

  const handleSave = () => {
    if (!imgRef.current || !completedCrop || !canvasRef.current) return

    const image = imgRef.current
    const canvas = canvasRef.current
    const crop = completedCrop

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const pixelRatio = window.devicePixelRatio
    canvas.width = crop.width * pixelRatio * scaleX
    canvas.height = crop.height * pixelRatio * scaleY

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    const brightnessValue = (brightness + 100) / 100

    ctx.filter = `brightness(${brightnessValue})`
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    )

    const editedImage = canvas.toDataURL('image/png')
    onSave(editedImage, {
      width: crop.width,
      height: crop.height,
      x: crop.x,
      y: crop.y,
    }, brightness)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Edit Photo</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <div
              ref={containerRef}
              className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
              >
                <img
                  ref={imgRef}
                  src={image}
                  alt="Crop"
                  onLoad={onImageLoad}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    maxWidth: '100%',
                    height: 'auto',
                    transition: isPanning ? 'none' : 'transform 0.1s',
                  }}
                />
              </ReactCrop>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="space-y-4">
            {/* Zoom Control */}
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
                onChange={(e) => {
                  const newZoom = parseFloat(e.target.value)
                  setZoom(newZoom)
                  if (newZoom <= 1) {
                    setPan({ x: 0, y: 0 })
                  }
                }}
                className="w-full"
              />
            </div>

            {/* Pan Control */}
            {zoom > 1 && (
              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <Move className="h-5 w-5" />
                  <span>Pan: Click and drag to move image</span>
                </label>
                <div className="text-sm text-gray-500">
                  Image is zoomed. Click and drag to pan around the image.
                </div>
              </div>
            )}

            {/* Rotation Control */}
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

            {/* Brightness Control */}
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

          <div className="flex justify-between space-x-4 mt-6">
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Reset
            </button>
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 transition font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
