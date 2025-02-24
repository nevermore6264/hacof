// src/hooks/useAuth.ts
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  return useAuthStore((state) => ({
    user: state.user,
    login: state.login,
    logout: state.logout,
    checkUser: state.checkUser,
    refreshToken: state.refreshToken,
    loading: state.loading,
  }));
}
