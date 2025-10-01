"use client"
import useSWR from "swr"
import { create } from "zustand"

type CartItem = { id: string; name: string; price: number; sku: string; image_url?: string; qty: number }

type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem, "qty">, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  open: () => void
  close: () => void
  isOpen: boolean
}

const useCartStore = create<CartState>((set) => ({
  items: [],
  add: (i, q = 1) =>
    set((s) => {
      const idx = s.items.findIndex((it) => it.id === i.id)
      if (idx > -1) {
        const items = [...s.items]
        items[idx] = { ...items[idx], qty: items[idx].qty + q }
        return { items }
      }
      return { items: [...s.items, { ...i, qty: q }] }
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  setQty: (id, qty) => set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, qty } : i)) })),
  clear: () => set({ items: [] }),
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

export function useCart() {
  const state = useCartStore()
  // Persist to localStorage via SWR revalidation
  useSWR("cart-sync", async () => {
    if (typeof window === "undefined") return null
    const raw = localStorage.getItem("cart")
    if (raw) {
      const parsed = JSON.parse(raw) as CartItem[]
      parsed.length && useCartStore.setState({ items: parsed })
    }
    return null
  })
  if (typeof window !== "undefined") {
    const unsub = useCartStore.subscribe((s) => {
      localStorage.setItem("cart", JSON.stringify(s.items))
    })
    // Note: Next.js cleans up on nav; safe to ignore unsubscribe here
  }
  return state
}
