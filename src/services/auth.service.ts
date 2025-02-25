import { apiService } from "@/services/apiService";
import { useAuthStore } from "@/store/authStore";

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  accessToken: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

class AuthService {
  private accessToken: string | null = null;

  getToken() {
    return this.accessToken;
  }

  async getUser() {
    return apiService.auth.get<User>("/auth/me");
  }

  async login(email: string, password: string) {
    const response = await apiService.public.post<LoginResponse>(
      "/auth/login",
      { email, password }
    );
    this.accessToken = response.accessToken;
    useAuthStore.getState().setAuth({ accessToken: this.accessToken });
    return response;
  }

  async logout() {
    try {
      await apiService.auth.post("/auth/logout", {});
    } finally {
      this.accessToken = null;
      useAuthStore.getState().setAuth({ user: null, accessToken: null });
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.accessToken;
        useAuthStore.getState().setAuth({ accessToken: this.accessToken });
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

export const authService = new AuthService();
