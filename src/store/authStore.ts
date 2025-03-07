// src/store/authStore.ts

import { create } from "zustand";
import { User } from "@/types/entities/users";
interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  setAuth: (data: Partial<AuthState>) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load accessToken from localStorage initially
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  return {
    user: null,
    accessToken: storedToken,
    loading: true,
    setAuth: (data) => {
      set((state) => {
        const newState = { ...state, ...data };

        // Persist accessToken to localStorage
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
  };
});
