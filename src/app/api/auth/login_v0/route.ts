// src/app/api/auth/login_v0/route.ts
import { NextResponse } from "next/server";
import { signToken } from "@/utils/jwt";
import { mockUser } from "@/mocks/auth.mock";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Mock authentication
    if (email !== "test@example.com" || password !== "password") {
      return NextResponse.json(
        { error: "Invalid credentials", errorCode: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const accessToken = signToken({ id: mockUser.id, email: mockUser.email });

    return NextResponse.json({ accessToken, user: mockUser });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", errorCode: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
