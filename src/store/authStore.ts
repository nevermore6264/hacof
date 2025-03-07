// src/store/authStore.ts

import { create } from "zustand";
import { User } from "@/types/entities/users";
interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  setAuth: (data: Partial<AuthState>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  loading: true,

  setAuth: (data) => {
    set((state) => {
      const newState = { ...state, ...data };

      // Only persist token to localStorage when it actually changes
      if (data.accessToken !== undefined) {
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        } else {
          localStorage.removeItem("accessToken");
        }
      }

      return newState;
    });
  },
}));
