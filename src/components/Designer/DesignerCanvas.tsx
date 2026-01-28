import { useRef } from 'react'
import Draggable from 'react-draggable'
import type { DesignData } from '../../types/design'

interface DesignerCanvasProps {
  designData: DesignData
  onUpdate: (data: Partial<DesignData>) => void
  cardType: 'paper' | 'metal'
  cardSize: 'standard' | 'large'
}

export default function DesignerCanvas({
  designData,
  onUpdate,
  cardType,
  cardSize,
}: DesignerCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  const cardWidth = cardSize === 'standard' ? 300 : 360
  const cardHeight = cardSize === 'standard' ? 450 : 540

  const getBorderGradient = (style: string, color: string) => {
    const gradients: Record<string, Record<string, string>> = {
      classic: {
        gold: 'from-gold-400 via-gold-500 to-gold-600',
        silver: 'from-gray-300 via-gray-400 to-gray-500',
        bronze: 'from-amber-600 via-amber-700 to-amber-800',
        copper: 'from-orange-600 via-orange-700 to-orange-800',
      },
      ornate: {
        gold: 'from-gold-300 via-gold-500 to-gold-700',
        silver: 'from-gray-200 via-gray-400 to-gray-600',
        bronze: 'from-amber-500 via-amber-700 to-amber-900',
        copper: 'from-orange-500 via-orange-700 to-orange-900',
      },
      modern: {
        gold: 'from-gold-400 to-gold-600',
        silver: 'from-gray-300 to-gray-600',
        bronze: 'from-amber-600 to-amber-800',
        copper: 'from-orange-600 to-orange-800',
      },
      elegant: {
        gold: 'from-gold-200 via-gold-400 to-gold-600',
        silver: 'from-gray-100 via-gray-300 to-gray-500',
        bronze: 'from-amber-400 via-amber-600 to-amber-800',
        copper: 'from-orange-400 via-orange-600 to-orange-800',
      },
    }
    const styleGradients = gradients[style]
    if (!styleGradients) return gradients.classic.gold
    return styleGradients[color] || gradients.classic.gold
  }

  const getBackgroundStyle = () => {
    if (cardType === 'metal') {
      const backgrounds: Record<string, string> = {
        brushed: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400',
        marble: 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300',
        solid: 'bg-gray-300',
      }
      const bg = designData.background || 'brushed'
      return backgrounds[bg] || backgrounds.brushed
    }
    return 'bg-white'
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        ref={canvasRef}
        className="relative shadow-2xl"
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          background: getBackgroundStyle(),
        }}
      >
        {/* Border */}
        {designData.borderStyle && (
          <div
            className={`absolute inset-0 border-8 bg-gradient-to-r ${getBorderGradient(
              designData.borderStyle,
              designData.borderColor || 'gold'
            )}`}
            style={{
              borderRadius: designData.borderStyle === 'modern' ? '8px' : '0px',
            }}
          />
        )}

        {/* Main Content Area */}
        <div
          className="absolute inset-8 flex flex-col items-center justify-center p-4"
          style={{ background: cardType === 'metal' ? 'transparent' : 'white' }}
        >
          {/* Photo */}
          {designData.photo && (
            <Draggable
              bounds="parent"
              defaultPosition={{ x: designData.photoX || 0, y: designData.photoY || 0 }}
              onStop={(_e, data) => onUpdate({ photoX: data.x, photoY: data.y })}
            >
              <div
                className="absolute cursor-move"
                style={{
                  width: `${designData.photoWidth || 150}px`,
                  height: `${designData.photoHeight || 150}px`,
                  transform: `rotate(${designData.photoRotation || 0}deg)`,
                  opacity: designData.photoBrightness
                    ? (designData.photoBrightness + 100) / 200
                    : 1,
                }}
              >
                <img
                  src={designData.photo}
                  alt="Memorial"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            </Draggable>
          )}

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            {designData.name && (
              <h2
                className="font-bold mb-2"
                style={{
                  fontSize: `${designData.nameSize || 24}px`,
                  fontFamily: designData.font || 'serif',
                  color: designData.textColor || '#000',
                }}
              >
                {designData.name}
              </h2>
            )}

            {designData.dates && (
              <p
                className="mb-4"
                style={{
                  fontSize: `${designData.dateSize || 18}px`,
                  fontFamily: designData.font || 'serif',
                  color: designData.textColor || '#000',
                }}
              >
                {designData.dates}
              </p>
            )}

            {designData.prayer && (
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{
                  fontSize: `${designData.prayerSize || 14}px`,
                  fontFamily: designData.font || 'serif',
                  color: designData.textColor || '#000',
                }}
              >
                {designData.prayer}
              </p>
            )}
          </div>

          {/* QR Code */}
          {designData.qrCode && (
            <Draggable
              bounds="parent"
              defaultPosition={{ x: designData.qrX || 0, y: designData.qrY || 0 }}
              onStop={(_e, data) => onUpdate({ qrX: data.x, qrY: data.y })}
            >
              <div className="absolute bottom-4 right-4 cursor-move bg-white p-2 rounded">
                <img src={designData.qrCode} alt="QR Code" className="w-16 h-16" />
              </div>
            </Draggable>
          )}

          {/* Funeral Home Logo */}
          {designData.funeralHomeLogo && (
            <Draggable
              bounds="parent"
              defaultPosition={{
                x: designData.logoX || 0,
                y: designData.logoY || 0,
              }}
              onStop={(_e, data) => onUpdate({ logoX: data.x, logoY: data.y })}
            >
              <div className="absolute cursor-move">
                <img
                  src={designData.funeralHomeLogo}
                  alt="Funeral Home"
                  className="h-12 w-auto"
                />
              </div>
            </Draggable>
          )}

          {/* Stickers/Icons */}
          {designData.stickers?.map((sticker, idx) => (
            <Draggable
              key={idx}
              bounds="parent"
              defaultPosition={{ x: sticker.x || 0, y: sticker.y || 0 }}
              onStop={(_e, data) => {
                const updated = [...(designData.stickers || [])]
                updated[idx] = { ...sticker, x: data.x, y: data.y }
                onUpdate({ stickers: updated })
              }}
            >
              <div className="absolute cursor-move" style={{ fontSize: '32px' }}>
                {sticker.emoji || sticker.icon}
              </div>
            </Draggable>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-600">
        {cardSize === 'standard' ? '3.5" × 5.25"' : '4" × 6"'} • Drag elements to reposition
      </p>
    </div>
  )
}
