import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentlyViewedStore = create(persist((set, get) => ({
  byUser: {},
  add: (userId, productId) => set((state) => ({ byUser: { ...state.byUser, [userId]: [productId, ...(state.byUser[userId] || []).filter((id) => id !== productId)].slice(0, 10) } })),
  remove: (userId, productId) => set((state) => ({ byUser: { ...state.byUser, [userId]: (state.byUser[userId] || []).filter((id) => id !== productId) } })),
  clear: (userId) => set((state) => ({ byUser: { ...state.byUser, [userId]: [] } })),
  getForUser: (userId) => get().byUser[userId] || [],
}), { name: 'diptyque-recently-viewed' }));
