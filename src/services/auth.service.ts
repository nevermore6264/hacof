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
  async refreshToken() {
    return apiService.auth.post<boolean>("/auth/refresh", {});
  },
};
