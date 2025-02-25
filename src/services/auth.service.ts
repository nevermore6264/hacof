// src/services/auth.service.ts
import { apiService } from "@/services/apiService";
import { tokenService } from "@/services/token.service";
import { useAuthStore } from "@/store/authStore";

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  accessToken: string;
}

class AuthService {
  async getUser() {
    return apiService.auth.get<User>("/auth/me");
  }

  async login(email: string, password: string) {
    const response = await apiService.public.post<LoginResponse>(
      "/auth/login",
      { email, password }
    );
    tokenService.setToken(response.accessToken);
    return response;
  }

  async logout() {
    try {
      await apiService.auth.post("/auth/logout", {});
    } finally {
      tokenService.setToken(null);
      useAuthStore.getState().setAuth({ user: null, accessToken: null });
    }
  }
}

export const authService = new AuthService();
