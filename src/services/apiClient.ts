import { refreshToken } from "./auth.service";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    await refreshToken(); // Try refreshing token if unauthorized
    return apiClient(endpoint, options); // Retry request
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
