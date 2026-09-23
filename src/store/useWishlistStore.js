import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(persist((set, get) => ({
  byUser: {},
  toggle: (userId, productId) => set((state) => {
    const list = state.byUser[userId] || [];
    return { byUser: { ...state.byUser, [userId]: list.includes(productId) ? list.filter((id) => id !== productId) : [...list, productId] } };
  }),
  getForUser: (userId) => get().byUser[userId] || [],
}), { name: 'diptyque-wishlist' }));
