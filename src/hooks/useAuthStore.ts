"use client";
import { create } from "zustand";
import { apiService } from "@/services/apiService";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  checkUser: async () => {
    try {
      const user = await apiService.get<User>("/auth/me");
      set({ user });
    } catch (error) {
      console.warn("User not authenticated. Trying to refresh token...");
      await useAuthStore.getState().refreshToken();
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    await apiService.post("/auth/login", { email, password });
    await useAuthStore.getState().checkUser();
  },

  logout: async () => {
    await apiService.post("/auth/logout", {});
    set({ user: null });
  },

  refreshToken: async () => {
    try {
      const refreshed = await apiService.post<boolean>("/auth/refresh", {});
      if (refreshed) {
        console.info("Token refreshed successfully");
        await useAuthStore.getState().checkUser();
        return true;
      } else {
        console.warn("Refresh token expired. Logging out...");
        useAuthStore.getState().logout();
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      useAuthStore.getState().logout();
      return false;
    }
  },
}));

// Call checkUser when app loads
useAuthStore.getState().checkUser();
