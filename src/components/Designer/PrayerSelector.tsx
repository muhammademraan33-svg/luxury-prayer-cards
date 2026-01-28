import { Check } from 'lucide-react'
import type { DesignData } from '../../types/design'

interface PrayerSelectorProps {
  designData: DesignData
  onUpdate: (data: Partial<DesignData>) => void
}

const prayers = [
  {
    id: 'eternal-rest',
    title: 'Eternal Rest',
    text: 'Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. May they rest in peace. Amen.',
  },
  {
    id: 'memorial',
    title: 'In Loving Memory',
    text: 'In loving memory of a life so beautifully lived and a heart so deeply loved. You will be forever in our hearts.',
  },
  {
    id: 'celebration',
    title: 'Celebration of Life',
    text: 'A life well-lived is a precious gift, of hope and strength and grace. You brought us joy and happiness, and memories time cannot erase.',
  },
  {
    id: 'peace',
    title: 'Peace',
    text: 'May you find peace in the arms of angels, and comfort in the hearts of those who love you. Rest in eternal peace.',
  },
  {
    id: 'garden',
    title: 'Garden of Memories',
    text: 'In the garden of memories, we meet every day. You are not forgotten, loved one, nor will you ever be. As long as life and memory last, we will remember you.',
  },
  {
    id: 'heaven',
    title: 'Heaven',
    text: 'Those we love don\'t go away, they walk beside us every day. Unseen, unheard, but always near, still loved, still missed, and very dear.',
  },
  {
    id: 'angel',
    title: 'Angel',
    text: 'An angel in the book of life wrote down our baby\'s birth, and whispered as she closed the book, "Too beautiful for earth."',
  },
  {
    id: 'legacy',
    title: 'Legacy',
    text: 'Your life was a blessing, your memory a treasure. You are loved beyond words and missed beyond measure.',
  },
  {
    id: 'forever',
    title: 'Forever',
    text: 'Forever in our hearts, forever in our thoughts. Your memory will live on in all of us who were blessed to know you.',
  },
  {
    id: 'light',
    title: 'Light',
    text: 'The light of a beautiful life still shines and will always shine. You touched our hearts in so many ways, your smile so warm and caring, your heart of gold.',
  },
  {
    id: 'love',
    title: 'Love',
    text: 'Love is how you stay alive, even after you are gone. Your love lives on in the hearts of all who knew you.',
  },
  {
    id: 'custom',
    title: 'Custom Prayer',
    text: '',
  },
]

export default function PrayerSelector({ designData, onUpdate }: PrayerSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4 text-white">Select Prayer</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {prayers.map((prayer) => (
          <button
            key={prayer.id}
            onClick={() =>
              onUpdate({
                prayer: prayer.id === 'custom' ? designData.prayer || '' : prayer.text,
              })
            }
            className={`w-full p-4 border-2 rounded-lg text-left transition ${
              designData.prayer === prayer.text
                ? 'border-gold-500 bg-gold-500/20 text-gold-500'
                : 'border-gray-600 bg-navy-800 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium mb-1">{prayer.title}</div>
                {prayer.text && (
                  <p className="text-sm text-gray-400 line-clamp-2">{prayer.text}</p>
                )}
              </div>
              {designData.prayer === prayer.text && (
                <Check className="h-5 w-5 text-gold-500 ml-2 flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      {designData.prayer && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2 text-white">Custom Prayer Text</label>
          <textarea
            value={designData.prayer}
            onChange={(e) => onUpdate({ prayer: e.target.value })}
            className="w-full p-3 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            rows={4}
            placeholder="Enter your custom prayer or message..."
          />
        </div>
      )}
    </div>
  )
}
