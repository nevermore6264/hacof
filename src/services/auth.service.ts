// src/services/auth.service.ts
import { apiClient } from "./apiClient";

export async function login(email: string, password: string) {
  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginSimulate(email: string, password: string) {
  // Simulate API request
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "user@example.com" && password === "123456") {
        resolve("Success");
      } else {
        reject("Invalid credentials");
      }
    }, 1000);
  });
}

export async function logout() {
  return apiClient("/auth/logout", { method: "POST" });
}

export async function refreshToken() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Session expired");

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
}
