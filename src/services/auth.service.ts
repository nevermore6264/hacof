// src/services/auth.service.ts
import { apiService } from "@/services/apiService";

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  accessToken: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const authService = {
  async getUser() {
    return apiService.auth.get<User>("/auth/me");
  },
  async login(email: string, password: string) {
    const response = await apiService.public.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    );
    return { accessToken: response.accessToken };
  },
  async logout() {
    return apiService.auth.post("/auth/logout", {});
  },

  async refreshToken(): Promise<{ accessToken: string | null }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return { accessToken: data.accessToken };
      } else {
        console.warn("Token refresh failed. User must re-login.");
        return { accessToken: null };
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return { accessToken: null };
    }
  },
};
