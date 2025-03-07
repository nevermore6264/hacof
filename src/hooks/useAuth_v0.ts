// src/hooks/useAuth_v0.ts
import { useAuthStore } from "@/store/authStore";
import { authService_v0 } from "@/services/auth.service_v0";
import { useEffect } from "react";

export function useAuth() {
  const { user, loading, setAuth } = useAuthStore();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("🔹 Checking localStorage accessToken:", accessToken);

    if (accessToken) {
      checkUser();
    } else {
      setAuth({ loading: false }); // Ensure loading is false if there's no token
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuth({ loading: true });
    try {
      const response = await authService_v0.login(email, password);
      console.log("🔹 Login response:", response);

      if (!response.accessToken) {
        console.error("❌ No accessToken received from login response");
        throw new Error("No accessToken received");
      }

      console.log(
        "🔹 Storing accessToken in localStorage:",
        response.accessToken
      );
      localStorage.setItem("accessToken", response.accessToken);

      const user = await authService_v0.getUser();
      console.log("🔹 User data after login:", user);
      setAuth({ user });
    } catch (error: any) {
      console.error("❌ Login failed:", error);
      localStorage.removeItem("accessToken");
      setAuth({ user: null });
    } finally {
      setAuth({ loading: false });
    }
  };

  const logout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      await authService_v0.logout(accessToken);
    }
    setAuth({ user: null });
    localStorage.removeItem("accessToken");
  };

  const checkUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.warn("❌ No accessToken, skipping checkUser");
      return;
    }

    setAuth({ loading: true });
    try {
      console.log("🔹 Fetching user with accessToken:", accessToken);
      const user = await authService_v0.getUser();
      console.log("🔹 Fetched user:", user);
      setAuth({ user });
    } catch (error) {
      console.error("❌ Failed to fetch user:", error);
      localStorage.removeItem("accessToken");
      setAuth({ user: null });
    } finally {
      setAuth({ loading: false });
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return null;
    try {
      const newToken = await authService_v0.refreshToken(accessToken);
      if (newToken) {
        localStorage.setItem("accessToken", newToken);
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
    loading,
    login,
    logout,
    checkUser,
    refreshAccessToken,
  };
}
