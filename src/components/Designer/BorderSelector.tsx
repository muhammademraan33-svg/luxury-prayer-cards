import { Check } from 'lucide-react'
import type { DesignData } from '../../types/design'

interface BorderSelectorProps {
  designData: DesignData
  onUpdate: (data: Partial<DesignData>) => void
}

const borderStyles = [
  { id: 'classic', name: 'Classic', description: 'Traditional elegant border' },
  { id: 'ornate', name: 'Ornate', description: 'Decorative detailed border' },
  { id: 'modern', name: 'Modern', description: 'Clean contemporary border' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated refined border' },
]

const borderColors = [
  { id: 'gold', name: 'Gold', class: 'bg-gradient-to-r from-gold-400 to-gold-600' },
  { id: 'silver', name: 'Silver', class: 'bg-gradient-to-r from-gray-300 to-gray-500' },
  { id: 'bronze', name: 'Bronze', class: 'bg-gradient-to-r from-amber-600 to-amber-800' },
  { id: 'copper', name: 'Copper', class: 'bg-gradient-to-r from-orange-600 to-orange-800' },
]

export default function BorderSelector({ designData, onUpdate }: BorderSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Border Style</h3>
        <div className="grid grid-cols-2 gap-4">
          {borderStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => onUpdate({ borderStyle: style.id as DesignData['borderStyle'] })}
              className={`p-4 border-2 rounded-lg text-left transition ${
                designData.borderStyle === style.id
                  ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                  : 'border-gray-600 bg-navy-800 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{style.name}</span>
                {designData.borderStyle === style.id && (
                  <Check className="h-5 w-5 text-gold-500" />
                )}
              </div>
              <p className="text-sm text-gray-400">{style.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Metallic Color</h3>
        <div className="grid grid-cols-4 gap-4">
          {borderColors.map((color) => (
            <button
              key={color.id}
              onClick={() => onUpdate({ borderColor: color.id as DesignData['borderColor'] })}
              className={`relative h-20 rounded-lg ${color.class} border-2 transition ${
                designData.borderColor === color.id
                  ? 'border-gold-500 ring-2 ring-gold-500/50'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              {designData.borderColor === color.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              )}
              <div className="absolute bottom-1 left-1 right-1 text-center">
                <span className="text-xs font-medium text-white drop-shadow">
                  {color.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
