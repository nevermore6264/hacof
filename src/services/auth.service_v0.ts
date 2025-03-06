// src/services/auth.service_v0.ts
import { apiService } from "@/services/apiService";
import { User } from "@/types/entities/users";
interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string };
}

class AuthService_v0 {
  async getUser(): Promise<User> {
    return apiService.auth.get<User>("/auth/me");
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      return await apiService.public.post<AuthResponse>("/auth/login_v0", {
        email,
        password,
      });
    } catch (error: any) {
      throw error.response?.data || { error: "Login failed" };
    }
  }

  async refreshToken(accessToken: string): Promise<string | null> {
    try {
      const response = await apiService.public.post<{ accessToken: string }>(
        "/auth/refresh_v0",
        { accessToken }
      );
      return response.accessToken;
    } catch (error: any) {
      throw error.response?.data || { error: "Token refresh failed" };
    }
  }

  async logout(accessToken: string): Promise<void> {
    try {
      await apiService.auth.post("/auth/logout_v0", { accessToken });
    } catch (error) {
      console.warn("Logout failed:", error);
    }
  }
}

export const authService_v0 = new AuthService_v0();
