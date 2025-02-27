// src/services/auth.service.ts
import { apiService } from "@/services/apiService";
import { tokenService } from "@/services/token.service";

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  accessToken: string;
}

class AuthService {
  async getUser(): Promise<User> {
    return apiService.auth.get<User>("/auth/me");
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiService.public.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    );

    tokenService.setToken(response.accessToken); // Store the token
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.auth.post("/auth/logout", {});
    } finally {
      tokenService.clearToken(); // Use a dedicated method for clearing tokens
    }
  }
}

export const authService = new AuthService();
