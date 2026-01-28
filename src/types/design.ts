export type DesignData = {
  cardType: 'paper' | 'metal'
  cardSize: 'standard' | 'large' // standard: 2.5"x4.25", large: 3"x4.75" (+$7)
  borderStyle?: 'classic' | 'ornate' | 'modern' | 'elegant' | 'floral' | 'geometric'
  borderColor?: 'gold' | 'silver' | 'bronze' | 'copper' | 'yellow' | 'pink' | 'white'
  background?: 'brushed' | 'marble' | 'solid'
  font?: string
  // Front card
  frontName?: string
  frontNameSize?: number
  frontNameX?: number
  frontNameY?: number
  frontNameBold?: boolean
  frontNameItalic?: boolean
  frontDates?: string
  frontDatesSize?: number
  frontDatesX?: number
  frontDatesY?: number
  frontDatesBold?: boolean
  frontDatesItalic?: boolean
  frontPhoto?: string
  frontPhotoX?: number
  frontPhotoY?: number
  frontPhotoWidth?: number
  frontPhotoHeight?: number
  // Back card
  backPrayer?: string
  backPrayerSize?: number
  backPrayerX?: number
  backPrayerY?: number
  backAdditionalText?: string
  backAdditionalTextShow?: boolean
  // Legacy fields (for backward compatibility)
  name?: string
  nameSize?: number
  dates?: string
  dateSize?: number
  prayer?: string
  prayerSize?: number
  textColor?: string
  photo?: string
  photoX?: number
  photoY?: number
  photoWidth?: number
  photoHeight?: number
  photoRotation?: number
  photoBrightness?: number
  qrCode?: string
  qrX?: number
  qrY?: number
  funeralHomeLogo?: string
  logoX?: number
  logoY?: number
  stickers?: Array<{ emoji?: string; icon?: string; x: number; y: number }>
  roundedCorners?: boolean // For metal cards
  quantity?: number
  // Add-ons & Upsells
  premiumThickness?: boolean // Premium thickness option (+$5)
  extraDesigns?: number // Number of extra designs (+$10 each)
  memorialPhotoPrint?: boolean // Memorial photo print add-on
  memorialPhotoSize?: '16x20' | '18x24' // Memorial photo print size
}
