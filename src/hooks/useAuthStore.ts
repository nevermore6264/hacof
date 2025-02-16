// src/hooks/useAuthStore.ts
"use client";
import { create } from "zustand";
import { authService } from "@/services/auth.service";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isRefreshing: boolean;
  refreshAttempts: number; // New state to track refresh attempts
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const MAX_REFRESH_ATTEMPTS = 3;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isRefreshing: false,
  refreshAttempts: 0, // Initialize refresh attempts

  checkUser: async () => {
    try {
      const user = await authService.getUser();
      set({ user, refreshAttempts: 0 }); // Reset attempts on success
    } catch (error) {
      console.warn("User not authenticated. Trying to refresh token...");
      const refreshed = await get().refreshToken();
      if (!refreshed) {
        console.warn("Token refresh failed. User must log in again.");
        await get().logout();
      }
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    await authService.login(email, password);
    await get().checkUser();
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, refreshAttempts: 0 });
  },

  refreshToken: async () => {
    const { isRefreshing, refreshAttempts } = get();
    if (isRefreshing || refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      console.warn("Max token refresh attempts reached.");
      return false;
    }

    set({ isRefreshing: true, refreshAttempts: refreshAttempts + 1 });

    try {
      const refreshed = await authService.refreshToken();
      if (refreshed) {
        console.info("Token refreshed successfully.");
        await get().checkUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    } finally {
      set({ isRefreshing: false });
    }
  },
}));

setTimeout(() => {
  useAuthStore.getState().checkUser();
}, 0); // Defer execution until after initial render
