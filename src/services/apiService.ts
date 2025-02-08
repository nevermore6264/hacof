// services/apiService.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface ApiResponse<T> {
  data: T;
  error?: string;
}

async function request<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  endpoint: string,
  payload?: Record<string, any>,
  customHeaders: HeadersInit = {},
  retry: boolean = true
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const options: RequestInit = {
    method,
    headers,
    credentials: "include", // Ensures cookies (tokens) are sent
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (response.status === 401 && retry) {
      console.warn("Token expired. Attempting refresh...");
      const refreshed = await refreshToken();
      if (refreshed) {
        return request<T>(method, endpoint, payload, customHeaders, false);
      }
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API request failed");
    }

    return data.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    throw error;
  }
}

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      console.info("Token refreshed successfully");
      return true;
    } else {
      console.warn("Token refresh failed. User must re-login.");
      return false;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

export const apiService = {
  get: <T>(endpoint: string, headers?: HeadersInit) =>
    request<T>("GET", endpoint, undefined, headers),
  post: <T>(
    endpoint: string,
    payload: Record<string, any>,
    headers?: HeadersInit
  ) => request<T>("POST", endpoint, payload, headers),
  patch: <T>(
    endpoint: string,
    payload: Record<string, any>,
    headers?: HeadersInit
  ) => request<T>("PATCH", endpoint, payload, headers),
  delete: <T>(endpoint: string, headers?: HeadersInit) =>
    request<T>("DELETE", endpoint, undefined, headers),
};
