import { create } from 'zustand';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPro: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setPro: (isPro: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isPro: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setPro: (isPro) => set({ isPro }),
  logout: () => set({ user: null, isAuthenticated: false, isPro: false }),
}));
