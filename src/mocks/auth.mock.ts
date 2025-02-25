// src/mocks/auth.mock.ts

export const mockUser = {
  id: "123",
  email: "test@example.com",
  name: "John Doe",
};

export let mockAccessToken: string | null = "mock_access_token";
let mockRefreshToken: string | null = "mock_refresh_token";

export function simulateLogin(email: string, password: string) {
  if (email === "test@example.com" && password === "password") {
    return {
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      user: mockUser,
    };
  }
  throw new Error("Invalid credentials");
}

export function simulateLogout() {
  mockAccessToken = null;
  mockRefreshToken = null;
}

export function simulateTokenRefresh() {
  if (mockRefreshToken) {
    mockAccessToken = "new_mock_access_token";
    return { accessToken: mockAccessToken };
  }
  throw new Error("Refresh token expired");
}
