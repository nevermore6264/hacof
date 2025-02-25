// src/services/token.service.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
import { useAuthStore } from "@/store/authStore";

class TokenService {
  private accessToken: string | null = null;

  getToken() {
    return this.accessToken;
  }

  setToken(token: string | null) {
    this.accessToken = token;
    useAuthStore.getState().setAuth({ accessToken: token });
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.accessToken);
        return true;
      } else {
        console.warn("Token refresh failed. User must re-login.");
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  }
}

export const tokenService = new TokenService();
