import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TEST_USER } from '../data/testUser';

const memoryAccounts = [];

export const useAuthStore = create(persist((set) => ({
  user: null,
  isAuthenticated: false,
  authError: null,
  loginWithCredentials: (username, password) => {
    const demoMatch = username === 'demo' && password === 'DIPTYQUE-demo-1234';
    const account = memoryAccounts.find((item) => item.username === username && item.password === password);
    if (!demoMatch && !account) {
      set({ authError: '아이디 또는 비밀번호를 확인해 주세요.' });
      return false;
    }
    const user = demoMatch ? TEST_USER : { ...TEST_USER, id: account.id, username, name: account.name, email: `${username}@example.com`, loginProvider: 'credentials' };
    set({ user, isAuthenticated: true, authError: null });
    return true;
  },
  signUp: ({ username, password, name }) => {
    if (username === 'demo' || memoryAccounts.some((item) => item.username === username)) return false;
    memoryAccounts.push({ id: `user-${Date.now()}`, username, password, name });
    return true;
  },
  loginAsTestUser: () => set({ user: TEST_USER, isAuthenticated: true, authError: null }),
  updateProfile: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
  logout: () => set({ user: null, isAuthenticated: false, authError: null }),
  clearAuthError: () => set({ authError: null }),
}), { name: 'diptyque-auth', partialize: ({ user, isAuthenticated }) => ({ user, isAuthenticated }) }));
