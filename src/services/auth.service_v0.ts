// src/services/auth.service_v0.ts
import { apiService } from "@/services/apiService_v0";
import { User } from "@/types/entities/user";
interface AuthResponse {
  token: string;
  authenticated: boolean;
}

class AuthService_v0 {
  async getUser(): Promise<User> {
    return apiService.auth.get<User>("/identity-service/api/v1/users/my-info");
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    return await apiService.public.post<AuthResponse>(
      "/identity-service/api/v1/auth/token",
      {
        username,
        password,
      }
    );
  }

  async logout(token: string): Promise<void> {
    await apiService.auth.post("/identity-service/api/v1/auth/logout", {
      token,
    });
  }
}

export const authService_v0 = new AuthService_v0();
