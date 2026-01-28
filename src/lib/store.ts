import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import type { DesignData } from '../types/design'

export type CartItem = {
  id: string
  product_type: 'card' | 'photo_print'
  design_data: DesignData | Record<string, unknown>
  quantity: number
  price: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateItem: (id: string, item: Partial<CartItem>) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const items = get().items
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
