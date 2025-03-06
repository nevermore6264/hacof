// src/hooks/useAuth_v0.ts
import { useAuthStore } from "@/store/authStore";
import { authService_v0 } from "@/services/auth.service_v0";
import { useEffect } from "react";

export function useAuth() {
  const { user, accessToken, loading, setAuth } = useAuthStore();

  useEffect(() => {
    if (loading) {
      checkUser();
    }
  }, [loading]);

  const login = async (email: string, password: string) => {
    setAuth({ loading: true });
    try {
      const response = await authService_v0.login(email, password);
      setAuth({ accessToken: response.accessToken });
      const user = await authService_v0.getUser();
      setAuth({ user });
    } catch (error: any) {
      if (error?.errorCode === "INVALID_CREDENTIALS") {
        console.error("Invalid login credentials");
      }
      setAuth({ user: null, accessToken: null });
    } finally {
      setAuth({ loading: false });
    }
  };

  const logout = async () => {
    if (accessToken) {
      await authService_v0.logout(accessToken);
    }
    setAuth({ user: null, accessToken: null });
  };

  const checkUser = async () => {
    setAuth({ loading: true });
    try {
      const user = await authService_v0.getUser();
      setAuth({ user });
    } catch {
      setAuth({ user: null, accessToken: null });
    } finally {
      setAuth({ loading: false });
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!accessToken) return null;
    try {
      const newToken = await authService_v0.refreshToken(accessToken);
      if (newToken) {
        setAuth({ accessToken: newToken });
      }
      return newToken;
    } catch (error: any) {
      if (
        error?.errorCode === "INVALID_TOKEN" ||
        error?.errorCode === "SESSION_EXPIRED"
      ) {
        console.warn("Session expired, logging out...");
        logout();
      }
      return null;
    }
  };

  return {
    user,
    accessToken,
    loading,
    login,
    logout,
    checkUser,
    refreshAccessToken,
  };
}
