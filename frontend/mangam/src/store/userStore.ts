// store/useAuthStore.ts
import { create } from "zustand";

interface User {
  userId: string;
  username: string;
  is_admin: boolean;
  email: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
