import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(persist((set) => ({
  items: [],
  addItem: (product, quantity = 1) => set((state) => {
    const current = state.items.find((item) => item.id === product.id);
    return { items: current ? state.items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) : [...state.items, { ...product, quantity }] };
  }),
  removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  setQuantity: (id, quantity) => set((state) => ({ items: quantity < 1 ? state.items.filter((item) => item.id !== id) : state.items.map((item) => item.id === id ? { ...item, quantity } : item) })),
  clear: () => set({ items: [] }),
}), { name: 'diptyque-cart' }));
