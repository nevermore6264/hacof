// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import { login, logout } from "@/services/auth.service";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Fetch user data
    }
  }, []);

  return { user, login, logout };
}
