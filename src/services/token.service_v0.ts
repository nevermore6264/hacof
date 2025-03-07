// src/services/token.service_v0.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
import { useAuthStore } from "@/store/authStore";

class TokenService_v0 {
  async refreshToken(accessToken: string): Promise<string | null> {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) return null;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh_v0`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      if (response.ok) {
        const data = await response.json();
        useAuthStore.getState().setAuth({ accessToken: data.accessToken });
        localStorage.setItem("accessToken", data.accessToken);
        console.warn("Access token successfully refreshed (v0).");
        return data.accessToken;
      } else {
        console.warn("Token refresh failed (v0). User must re-login.");
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token (v0):", error);
      return null;
    }
  }
}

export const tokenService_v0 = new TokenService_v0();
