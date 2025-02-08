"use client";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect, useState } from "react";

export function useAuth() {
  const { user, login, logout, checkUser, loading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function initAuth() {
      await checkUser();
      setIsChecking(false);
    }
    initAuth();
  }, [checkUser]);

  return { user, login, logout, loading, isChecking };
}
