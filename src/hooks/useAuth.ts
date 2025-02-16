// src/hooks/useAuth.ts
"use client";
import { useAuthStore } from "@/hooks/useAuthStore";

export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    login: state.login,
    logout: state.logout,
    checkUser: state.checkUser,
    loading: state.loading,
  }));
}
