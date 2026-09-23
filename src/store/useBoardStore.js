import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_POSTS } from '../data/posts';

export const useBoardStore = create(persist((set, get) => ({
  posts: INITIAL_POSTS,
  addPost: (payload) => {
    const post = { ...payload, id: `post-${Date.now()}`, likes: 0, views: 0, createdAt: new Date().toISOString() };
    set((state) => ({ posts: [post, ...state.posts] }));
    return post.id;
  },
  updatePost: (id, userId, updates) => set((state) => ({ posts: state.posts.map((post) => post.id === id && post.userId === userId ? { ...post, ...updates, updatedAt: new Date().toISOString() } : post) })),
  incrementViews: (id) => set((state) => ({ posts: state.posts.map((post) => post.id === id ? { ...post, views: post.views + 1 } : post) })),
  toggleLike: (id) => set((state) => ({ posts: state.posts.map((post) => post.id === id ? { ...post, likes: post.likes + 1 } : post) })),
  deletePost: (id, userId) => set((state) => ({ posts: state.posts.filter((post) => !(post.id === id && post.userId === userId)) })),
  getById: (id) => get().posts.find((post) => post.id === id),
}), { name: 'diptyque-board' }));
