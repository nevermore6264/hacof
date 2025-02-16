// src/services/auth.service.ts
import { apiService } from "@/services/apiService";

interface User {
  id: string;
  email: string;
  name: string;
}

export const authService = {
  async getUser() {
    return apiService.auth.get<User>("/auth/me");
  },
  async login(email: string, password: string) {
    return apiService.public.post("/auth/login", { email, password });
  },
  async logout() {
    return apiService.auth.post("/auth/logout", {});
  },
  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        console.info("Token refreshed successfully.");
        return true;
      } else {
        console.warn("Token refresh failed. User must re-login.");
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  },
};
