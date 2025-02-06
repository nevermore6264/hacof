// src/services/user.service.ts
import { apiClient } from "./apiClient";

export async function getUserProfile() {
  return apiClient("/user/profile");
}
