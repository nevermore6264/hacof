// src/app/api/chats/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
import { mockUsers } from "@/mocks/auth.mock";

export async function POST(req: Request) {
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
        const token = authHeader.split(" ")[1];
        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: "Invalid token", errorCode: "INVALID_TOKEN" },
                { status: 401 }
            );
        }

        // Lấy dữ liệu từ body
        const { userIds } = await req.json();
        if (!userIds || !Array.isArray(userIds) {
            return NextResponse.json(
                { error: "Invalid user IDs", errorCode: "INVALID_INPUT" },
                { status: 400 }
            );
        }

        // Tìm thông tin người dùng từ danh sách userIds
        const selectedUsers = mockUsers.filter((user) => userIds.includes(user.id));
        if (selectedUsers.length === 0) {
            return NextResponse.json(
                { error: "No valid users found", errorCode: "NO_VALID_USERS" },
                { status: 400 }
            );
        }

        // Tạo chat mới
        const isGroup = selectedUsers.length > 1;
        const chatName = isGroup
            ? selectedUsers.map((user) => user.firstName).join(", ")
            : selectedUsers[0].firstName;

        const newChat = {
            id: Math.floor(Math.random() * 1000), // Tạo ID ngẫu nhiên
            name: chatName,
            image: isGroup
                ? "https://randomuser.me/api/portraits/men/99.jpg" // Ảnh mặc định cho nhóm
                : selectedUsers[0].avatarUrl, // Ảnh của người dùng trong chat 1-1
            lastMessage: "No messages yet",
            lastMessageTime: new Date().toLocaleTimeString(),
            messages: [],
        };

        // Trả về chat mới
        return NextResponse.json(newChat, { status: 201 });
    } catch (error) {
        console.error("Error creating chat:", error);
        return NextResponse.json(
            { error: "Something went wrong", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}