import jsPDF from 'jspdf'
import type { DesignData } from '../types/design'

export async function exportToPDF(designData: DesignData): Promise<void> {
  // Create a temporary canvas element to render the design
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  // Set canvas size for 300 DPI (3.5" x 5.25" at 300 DPI = 1050 x 1575 pixels)
  const dpi = 300
  const cardWidthInches = designData.cardSize === 'standard' ? 3.5 : 4
  const cardHeightInches = designData.cardSize === 'standard' ? 5.25 : 6
  const bleed = 0.125 // 1/8 inch bleed
  const totalWidth = (cardWidthInches + bleed * 2) * dpi
  const totalHeight = (cardHeightInches + bleed * 2) * dpi

  // Designer preview canvas size (CardPreview)
  const previewWidth = designData.cardSize === 'standard' ? 300 : 360
  const previewHeight = designData.cardSize === 'standard' ? 510 : 570
  const innerWidthPx = cardWidthInches * dpi
  const innerHeightPx = cardHeightInches * dpi
  const scaleX = innerWidthPx / previewWidth
  const scaleY = innerHeightPx / previewHeight

  canvas.width = totalWidth
  canvas.height = totalHeight

  // Draw background
  ctx.fillStyle = designData.cardType === 'metal' ? '#E5E7EB' : '#FFFFFF'
  ctx.fillRect(0, 0, totalWidth, totalHeight)

  // Draw border
  if (designData.borderStyle) {
    const borderWidth = 8 * (dpi / 72) // Convert to pixels
    ctx.fillStyle = getBorderColor(designData.borderColor || 'gold')
    ctx.fillRect(0, 0, totalWidth, totalHeight)
    ctx.fillStyle = designData.cardType === 'metal' ? '#E5E7EB' : '#FFFFFF'
    ctx.fillRect(borderWidth, borderWidth, totalWidth - borderWidth * 2, totalHeight - borderWidth * 2)
  }

  // Draw photo (uses frontPhoto positions if available)
  const photoSrc = designData.frontPhoto || designData.photo
  if (photoSrc) {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = photoSrc
    })

    const previewPhotoWidth = designData.frontPhotoWidth || designData.photoWidth || 200
    const previewPhotoHeight = designData.frontPhotoHeight || designData.photoHeight || 200
    const previewPhotoCenterX =
      designData.frontPhotoX ?? designData.photoX ?? previewWidth / 2
    const previewPhotoCenterY =
      designData.frontPhotoY ?? designData.photoY ?? previewHeight / 2

    const previewPhotoLeft = previewPhotoCenterX - previewPhotoWidth / 2
    const previewPhotoTop = previewPhotoCenterY - previewPhotoHeight / 2

    const photoX = bleed * dpi + previewPhotoLeft * scaleX
    const photoY = bleed * dpi + previewPhotoTop * scaleY
    const photoWidth = previewPhotoWidth * scaleX
    const photoHeight = previewPhotoHeight * scaleY

    ctx.save()
    const rotation = (designData.photoRotation || 0) * (Math.PI / 180)
    ctx.translate(photoX + photoWidth / 2, photoY + photoHeight / 2)
    ctx.rotate(rotation)
    ctx.drawImage(img, -photoWidth / 2, -photoHeight / 2, photoWidth, photoHeight)
    ctx.restore()
  }

  // Draw text (uses frontName/frontDates positions when available)
  ctx.fillStyle = designData.textColor || '#000000'
  ctx.font = `${(designData.nameSize || 24) * (dpi / 72)}px ${designData.font || 'serif'}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const centerX = totalWidth / 2
  let currentY = totalHeight / 2 - 100 * (dpi / 72)

  if (designData.name) {
    const nameFontSize = (designData.nameSize || 24) * (dpi / 72)
    ctx.font = `${nameFontSize}px ${designData.font || 'serif'}`

    const namePreviewX = designData.frontNameX ?? previewWidth / 2
    const namePreviewY =
      designData.frontNameY ?? previewHeight * 0.6

    const nameX = bleed * dpi + namePreviewX * scaleX
    const nameY = bleed * dpi + namePreviewY * scaleY

    ctx.fillText(designData.frontName || designData.name, nameX, nameY)
    currentY += 50 * (dpi / 72)
  }

  if (designData.dates) {
    const dateFontSize = (designData.dateSize || 18) * (dpi / 72)
    ctx.font = `${dateFontSize}px ${designData.font || 'serif'}`

    const datesPreviewX = designData.frontDatesX ?? previewWidth / 2
    const datesPreviewY =
      designData.frontDatesY ?? previewHeight * 0.7

    const datesX = bleed * dpi + datesPreviewX * scaleX
    const datesY = bleed * dpi + datesPreviewY * scaleY

    ctx.fillText(designData.frontDates || designData.dates, datesX, datesY)
    currentY += 80 * (dpi / 72)
  }

  if (designData.prayer) {
    ctx.font = `${(designData.prayerSize || 14) * (dpi / 72)}px ${designData.font || 'serif'}`
    const words = designData.prayer.split(' ')
    const lineHeight = (designData.prayerSize || 14) * 1.5 * (dpi / 72)
    const maxWidth = (cardWidthInches - 0.5) * dpi
    let line = ''
    let y = currentY

    for (const word of words) {
      const testLine = line + word + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, centerX, y)
        line = word + ' '
        y += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, centerX, y)
  }

  // Draw QR code
  if (designData.qrCode) {
    const qrImg = new Image()
    await new Promise((resolve, reject) => {
      qrImg.onload = resolve
      qrImg.onerror = reject
      qrImg.src = designData.qrCode!
    })

    const qrSize = 64 * (dpi / 72)
    const qrX = totalWidth - qrSize - 32 * (dpi / 72) - bleed * dpi
    const qrY = totalHeight - qrSize - 32 * (dpi / 72) - bleed * dpi
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
  }

  // Draw stickers (emoji/icons) at their dragged positions
  if (designData.stickers && designData.stickers.length > 0) {
    for (const sticker of designData.stickers) {
      const stickerXPreview = sticker.x
      const stickerYPreview = sticker.y
      const stickerX = bleed * dpi + stickerXPreview * scaleX
      const stickerY = bleed * dpi + stickerYPreview * scaleY

      ctx.font = `${32 * (dpi / 72)}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const glyph = sticker.emoji || sticker.icon || ''
      if (glyph) {
        ctx.fillText(glyph, stickerX, stickerY)
      }
    }
  }

  // Draw funeral home logo if present
  if (designData.funeralHomeLogo) {
    const logoImg = new Image()
    await new Promise((resolve, reject) => {
      logoImg.onload = resolve
      logoImg.onerror = reject
      logoImg.src = designData.funeralHomeLogo!
    })

    const logoCenterXPreview = designData.logoX ?? previewWidth * 0.8
    const logoCenterYPreview = designData.logoY ?? previewHeight * 0.85
    const logoWidthPreview = previewWidth * 0.25
    const logoHeightPreview =
      (logoWidthPreview / logoImg.width) * logoImg.height

    const logoLeftPreview = logoCenterXPreview - logoWidthPreview / 2
    const logoTopPreview = logoCenterYPreview - logoHeightPreview / 2

    const logoX = bleed * dpi + logoLeftPreview * scaleX
    const logoY = bleed * dpi + logoTopPreview * scaleY
    const logoWidth = logoWidthPreview * scaleX
    const logoHeight = logoHeightPreview * scaleY

    ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight)
  }

  // Draw crop marks
  const cropMarkLength = 20 * (dpi / 72)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1

  // Top-left
  ctx.beginPath()
  ctx.moveTo(bleed * dpi, bleed * dpi - cropMarkLength)
  ctx.lineTo(bleed * dpi, bleed * dpi)
  ctx.moveTo(bleed * dpi - cropMarkLength, bleed * dpi)
  ctx.lineTo(bleed * dpi, bleed * dpi)
  ctx.stroke()

  // Top-right
  ctx.beginPath()
  ctx.moveTo(totalWidth - bleed * dpi, bleed * dpi - cropMarkLength)
  ctx.lineTo(totalWidth - bleed * dpi, bleed * dpi)
  ctx.moveTo(totalWidth - bleed * dpi + cropMarkLength, bleed * dpi)
  ctx.lineTo(totalWidth - bleed * dpi, bleed * dpi)
  ctx.stroke()

  // Bottom-left
  ctx.beginPath()
  ctx.moveTo(bleed * dpi, totalHeight - bleed * dpi + cropMarkLength)
  ctx.lineTo(bleed * dpi, totalHeight - bleed * dpi)
  ctx.moveTo(bleed * dpi - cropMarkLength, totalHeight - bleed * dpi)
  ctx.lineTo(bleed * dpi, totalHeight - bleed * dpi)
  ctx.stroke()

  // Bottom-right
  ctx.beginPath()
  ctx.moveTo(totalWidth - bleed * dpi, totalHeight - bleed * dpi + cropMarkLength)
  ctx.lineTo(totalWidth - bleed * dpi, totalHeight - bleed * dpi)
  ctx.moveTo(totalWidth - bleed * dpi + cropMarkLength, totalHeight - bleed * dpi)
  ctx.lineTo(totalWidth - bleed * dpi, totalHeight - bleed * dpi)
  ctx.stroke()

  // Create PDF
  const pdf = new jsPDF({
    orientation: cardWidthInches < cardHeightInches ? 'portrait' : 'landscape',
    unit: 'in',
    format: [cardWidthInches + bleed * 2, cardHeightInches + bleed * 2],
  })

  const imgData = canvas.toDataURL('image/png', 1.0)
  pdf.addImage(imgData, 'PNG', 0, 0, cardWidthInches + bleed * 2, cardHeightInches + bleed * 2)

  pdf.save(`prayer-card-${Date.now()}.pdf`)
}

function getBorderColor(color: string): string {
  const colors: Record<string, string> = {
    gold: '#F59E0B',
    silver: '#9CA3AF',
    bronze: '#D97706',
    copper: '#EA580C',
  }
  return colors[color] || colors.gold
}
