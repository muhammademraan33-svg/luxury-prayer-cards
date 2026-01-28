import { Camera } from 'lucide-react'
import Draggable from 'react-draggable'
import MetallicBorder from './MetallicBorder'
import type { DesignData } from '../../types/design'

interface CardPreviewProps {
  designData: DesignData
  onUpdate: (data: Partial<DesignData>) => void
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  view: 'front' | 'back'
  onViewChange: (view: 'front' | 'back') => void
}

export default function CardPreview({
  designData,
  onUpdate,
  onPhotoUpload,
  view,
  onViewChange,
}: CardPreviewProps) {
  // Card dimensions: Standard 2.5"x4.25", Large 3"x4.75"
  // At 120 DPI for preview
  const isStandard = designData.cardSize === 'standard'
  const cardWidth = isStandard ? 300 : 360
  const cardHeight = isStandard ? 510 : 570
  const isMetal = designData.cardType === 'metal'
  const borderRadius = isMetal && designData.roundedCorners ? '12px' : '0px'

  // Auto-placement for text (centered by default)
  const getAutoPosition = (element: 'name' | 'dates' | 'photo') => {
    if (element === 'photo') {
      return { x: cardWidth / 2, y: 120, width: 200, height: 200 }
    }
    if (element === 'name') {
      return { x: cardWidth / 2, y: view === 'front' ? 320 : 200 }
    }
    if (element === 'dates') {
      return { x: cardWidth / 2, y: view === 'front' ? 360 : 240 }
    }
    return { x: cardWidth / 2, y: cardHeight / 2 }
  }

  const photoPos = designData.frontPhoto
    ? {
        x: designData.frontPhotoX ?? getAutoPosition('photo').x,
        y: designData.frontPhotoY ?? getAutoPosition('photo').y,
        width: designData.frontPhotoWidth ?? 200,
        height: designData.frontPhotoHeight ?? 200,
      }
    : { ...getAutoPosition('photo'), width: 200, height: 200 }

  const namePos = {
    x: designData.frontNameX ?? getAutoPosition('name').x,
    y: designData.frontNameY ?? getAutoPosition('name').y,
  }

  const datesPos = {
    x: designData.frontDatesX ?? getAutoPosition('dates').x,
    y: designData.frontDatesY ?? getAutoPosition('dates').y,
  }

  const getBackgroundStyle = () => {
    if (isMetal) {
      const backgrounds: Record<string, string> = {
        brushed: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%)',
        marble: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 25%, #f5f5f5 50%, #e8e8e8 75%, #f5f5f5 100%)',
        solid: 'linear-gradient(135deg, #d4d4d4 0%, #f0f0f0 100%)',
      }
      return backgrounds[designData.background || 'brushed'] || backgrounds.brushed
    }
    return '#ffffff'
  }

  return (
    <div className="space-y-4">
      {/* Size Selection */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2 uppercase">CARD SIZE</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ cardSize: 'standard' })}
            className={`px-4 py-3 rounded border-2 transition text-left ${
              designData.cardSize === 'standard'
                ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                : 'border-gray-600 bg-navy-800 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="text-sm font-medium">2.5"x4.25"</div>
            <div className="text-xs">Included</div>
          </button>
          <button
            onClick={() => onUpdate({ cardSize: 'large' })}
            className={`px-4 py-3 rounded border-2 transition text-left ${
              designData.cardSize === 'large'
                ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                : 'border-gray-600 bg-navy-800 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="text-sm font-medium">3"x4.75"</div>
            <div className="text-xs font-semibold">+$7</div>
          </button>
        </div>
      </div>

      {/* Front/Back Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewChange('front')}
          className={`flex-1 px-4 py-2 rounded border-2 transition font-medium ${
            view === 'front'
              ? 'border-gold-500 bg-gold-500/20 text-gold-500'
              : 'border-gray-600 bg-navy-800 text-gray-300 hover:border-gray-500'
          }`}
        >
          Front
        </button>
        <button
          onClick={() => onViewChange('back')}
          className={`flex-1 px-4 py-2 rounded border-2 transition font-medium ${
            view === 'back'
              ? 'border-gold-500 bg-gold-500/20 text-gold-500'
              : 'border-gray-600 bg-navy-800 text-gray-300 hover:border-gray-500'
          }`}
        >
          Back
        </button>
      </div>

      {/* Card Preview */}
      <div className="relative bg-navy-900 rounded-lg p-6">
        <div
          className="relative mx-auto bg-white shadow-2xl"
          style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            borderRadius: borderRadius,
            background: getBackgroundStyle(),
            maxWidth: '100%',
          }}
        >
          {/* Metallic Border */}
          {designData.borderStyle && (
            <MetallicBorder
              style={designData.borderStyle}
              color={designData.borderColor || 'gold'}
              className="rounded"
            />
          )}

          {/* Content Area - Draggable Container */}
          <div
            className="absolute inset-0 p-4 overflow-hidden"
            style={{ borderRadius: borderRadius }}
            id="card-canvas"
          >
            {view === 'front' ? (
              <>
                {/* Photo - Draggable */}
                {designData.frontPhoto ? (
                  <Draggable
                    bounds="parent"
                    position={{ x: photoPos.x - photoPos.width / 2, y: photoPos.y - photoPos.height / 2 }}
                    onStop={(_e, data) => {
                      onUpdate({
                        frontPhotoX: data.x + photoPos.width / 2,
                        frontPhotoY: data.y + photoPos.height / 2,
                      })
                    }}
                  >
                    <div className="absolute cursor-move group">
                      <img
                        src={designData.frontPhoto}
                        alt="Memorial"
                        className="object-cover rounded shadow-lg group-hover:ring-2 group-hover:ring-gold-500 transition"
                        style={{
                          width: `${photoPos.width}px`,
                          height: `${photoPos.height}px`,
                        }}
                      />
                    </div>
                  </Draggable>
                ) : (
                  <label
                    className="absolute cursor-pointer flex flex-col items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300 hover:border-gold-500 transition"
                    style={{
                      left: `${photoPos.x - photoPos.width / 2}px`,
                      top: `${photoPos.y - photoPos.height / 2}px`,
                      width: `${photoPos.width}px`,
                      height: `${photoPos.height}px`,
                    }}
                  >
                    <input type="file" accept="image/*" onChange={onPhotoUpload} className="hidden" />
                    <Camera className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-600">Click to upload</span>
                  </label>
                )}

                {/* Name - Draggable */}
                {designData.frontName && (
                  <Draggable
                    bounds="parent"
                    position={{ x: namePos.x, y: namePos.y }}
                    onStop={(_e, data) => {
                      onUpdate({
                        frontNameX: data.x,
                        frontNameY: data.y,
                      })
                    }}
                  >
                    <div
                      className="absolute cursor-move text-center group"
                      style={{
                        fontFamily:
                          designData.font === 'script'
                            ? 'Dancing Script, cursive'
                            : designData.font === 'serif'
                            ? 'Great Vibes, cursive'
                            : designData.font === 'elegant'
                            ? 'Playfair Display, serif'
                            : 'serif',
                        fontSize: `${designData.frontNameSize || 24}px`,
                        fontWeight: designData.frontNameBold ? 'bold' : 'normal',
                        fontStyle: designData.frontNameItalic ? 'italic' : 'normal',
                        color: designData.textColor || '#000000',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Drag to move
                      </div>
                      {designData.frontName || 'Name Here'}
                    </div>
                  </Draggable>
                )}

                {/* Dates - Draggable */}
                {designData.frontDates && (
                  <Draggable
                    bounds="parent"
                    position={{ x: datesPos.x, y: datesPos.y }}
                    onStop={(_e, data) => {
                      onUpdate({
                        frontDatesX: data.x,
                        frontDatesY: data.y,
                      })
                    }}
                  >
                    <div
                      className="absolute cursor-move text-center group"
                      style={{
                        fontFamily: 'serif',
                        fontSize: `${designData.frontDatesSize || 18}px`,
                        fontWeight: designData.frontDatesBold ? 'bold' : 'normal',
                        fontStyle: designData.frontDatesItalic ? 'italic' : 'normal',
                        color: designData.textColor || '#000000',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Drag to move
                      </div>
                      {designData.frontDates || 'January 1, 1945 - December 31, 2025'}
                    </div>
                  </Draggable>
                )}

                {/* QR Code - Draggable */}
                {designData.qrCode && (
                  <Draggable
                    bounds="parent"
                    position={{ x: designData.qrX || cardWidth - 80, y: designData.qrY || cardHeight - 80 }}
                    onStop={(_e, data) => {
                      onUpdate({
                        qrX: data.x,
                        qrY: data.y,
                      })
                    }}
                  >
                    <div className="absolute cursor-move bg-white p-2 rounded shadow-lg group">
                      <img src={designData.qrCode} alt="QR Code" className="w-16 h-16" />
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Drag to move
                      </div>
                    </div>
                  </Draggable>
                )}

                {/* Funeral Home Logo - Draggable */}
                {designData.funeralHomeLogo && (
                  <Draggable
                    bounds="parent"
                    position={{ x: designData.logoX || 20, y: designData.logoY || 20 }}
                    onStop={(_e, data) => {
                      onUpdate({
                        logoX: data.x,
                        logoY: data.y,
                      })
                    }}
                  >
                    <div className="absolute cursor-move group">
                      <img
                        src={designData.funeralHomeLogo}
                        alt="Funeral Home Logo"
                        className="h-16 w-auto object-contain"
                      />
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Drag to move
                      </div>
                    </div>
                  </Draggable>
                )}

                {/* Stickers - Draggable */}
                {designData.stickers?.map((sticker, idx) => (
                  <Draggable
                    key={idx}
                    bounds="parent"
                    position={{ x: sticker.x || cardWidth / 2, y: sticker.y || cardHeight / 2 }}
                    onStop={(_e, data) => {
                      const updated = [...(designData.stickers || [])]
                      updated[idx] = { ...sticker, x: data.x, y: data.y }
                      onUpdate({ stickers: updated })
                    }}
                  >
                    <div className="absolute cursor-move text-3xl group" style={{ fontSize: '32px' }}>
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Drag to move
                      </div>
                      {sticker.emoji || sticker.icon}
                    </div>
                  </Draggable>
                ))}
              </>
            ) : (
              /* Back Card */
              <div className="h-full flex items-center justify-center p-8">
                <div
                  className="text-center"
                  style={{
                    fontFamily:
                      designData.font === 'script'
                        ? 'Dancing Script, cursive'
                        : designData.font === 'elegant'
                        ? 'Playfair Display, serif'
                        : 'serif',
                    fontSize: `${designData.backPrayerSize || 14}px`,
                    color: designData.textColor || '#000000',
                    lineHeight: '1.6',
                  }}
                >
                  {designData.backPrayer || designData.prayer || 'The Lord is my shepherd; I shall not want...'}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-2 text-sm text-gray-400">
          {view === 'front' ? 'Front of card - Drag elements to position' : 'Back of card'}
        </div>
      </div>
    </div>
  )
}
