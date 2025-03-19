// src/app/api/user/route.ts
import { NextResponse } from "next/server";
// import { verifyToken } from "@/utils/jwt";
import { mockUsers } from "@/mocks/auth.mock";

export async function GET(req: Request) {
    try {
        // Kiểm tra token từ header
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        // Xác thực token
        // const token = authHeader.split(" ")[1];
        // const payload = verifyToken(token);
        // if (!payload) {
        //     return NextResponse.json(
        //         { error: "Invalid token", errorCode: "INVALID_TOKEN" },
        //         { status: 401 }
        //     );
        // }

        // Trả về danh sách người dùng (loại bỏ thông tin nhạy cảm như mật khẩu)
        const users = mockUsers.map((user) => ({
            id: user?.id,
            name: user?.firstName + " " + user?.lastName,
            image: user?.avatarUrl,
        }));

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Something went wrong", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}