import { NextResponse } from "next/server";
import { mockUsers } from "@/mocks/auth.mock";

export async function POST(req: Request) {
    try {
        // Xác thực token (giữ nguyên như cũ)
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        // Lấy dữ liệu từ body
        const { userIds } = await req.json();
        if (!userIds || userIds.length !== 1) { // 👈 Chỉ cho phép 1 user
            return NextResponse.json(
                { error: "Single chat requires exactly 1 user", errorCode: "INVALID_INPUT" },
                { status: 400 }
            );
        }

        // Tạo chat 1-1
        const user = mockUsers.find((u) => u.id === userIds[0]);
        if (!user) {
            return NextResponse.json(
                { error: "User not found", errorCode: "USER_NOT_FOUND" },
                { status: 404 }
            );
        }

        const newChat = {
            id: Math.floor(Math.random() * 1000),
            name: user.firstName,
            image: user.avatarUrl,
            lastMessage: "No messages yet",
            lastMessageTime: new Date().toLocaleTimeString(),
            messages: [],
            isGroup: false // 👈 Thêm trường isGroup
        };

        return NextResponse.json(newChat, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}