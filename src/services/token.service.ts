// src/services/token.service.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const tokenService = {
  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

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
