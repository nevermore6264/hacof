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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isRefreshing: false,

  checkUser: async () => {
    try {
      const user = await authService.getUser();
      set({ user });
    } catch (error) {
      console.warn("User not authenticated. Trying to refresh token...");
      await get().refreshToken();
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
    set({ user: null });
  },

  refreshToken: async () => {
    if (get().isRefreshing) return false;

    set({ isRefreshing: true });
    try {
      const refreshed = await authService.refreshToken();
      if (refreshed) {
        console.info("Token refreshed successfully");
        await get().checkUser();
        return true;
      } else {
        console.warn("Refresh token expired. Logging out...");
        get().logout();
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      get().logout();
      return false;
    } finally {
      set({ isRefreshing: false });
    }
  },
}));

// Call checkUser when app loads
useAuthStore.getState().checkUser();
