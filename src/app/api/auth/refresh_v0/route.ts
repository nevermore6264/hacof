// src/app/api/auth/refresh_v0/route.ts
import { NextResponse } from "next/server";
import { verifyToken, signToken } from "@/utils/jwt";

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    // Verify the expired token (ignore expiration)
    const payload = verifyToken(accessToken, { ignoreExpiration: true });

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token", errorCode: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = signToken({ id: payload.id, email: payload.email });

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (error) {
    return NextResponse.json(
      { error: "Session expired", errorCode: "SESSION_EXPIRED" },
      { status: 401 }
    );
  }
}
