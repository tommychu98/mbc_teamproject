import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_INQUIRIES } from '../data/inquiries';

export const useInquiryStore = create(persist((set, get) => ({
  inquiries: INITIAL_INQUIRIES,
  addInquiry: (payload) => {
    const inquiry = { ...payload, id: `inquiry-${Date.now()}`, status: 'PENDING', answer: null, createdAt: new Date().toISOString(), updatedAt: null };
    set((state) => ({ inquiries: [inquiry, ...state.inquiries] }));
    return inquiry.id;
  },
  updateInquiry: (id, userId, updates) => set((state) => ({ inquiries: state.inquiries.map((item) => item.id === id && item.userId === userId && item.status !== 'ANSWERED' ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item) })),
  deleteInquiry: (id, userId) => set((state) => ({ inquiries: state.inquiries.filter((item) => !(item.id === id && item.userId === userId && item.status === 'PENDING')) })),
  getById: (id) => get().inquiries.find((item) => item.id === id),
}), { name: 'diptyque-inquiries' }));
