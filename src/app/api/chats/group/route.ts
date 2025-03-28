import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
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
        if (!userIds || userIds.length < 2) { // 👈 Yêu cầu ít nhất 2 users
            return NextResponse.json(
                { error: "Group chat requires at least 2 users", errorCode: "INVALID_INPUT" },
                { status: 400 }
            );
        }

        // Tạo group chat
        const selectedUsers = mockUsers.filter((user) => userIds.includes(user.id));
        const chatName = selectedUsers.map((user) => user.firstName).join(", ");

        const newChat = {
            id: Math.floor(Math.random() * 1000),
            name: chatName,
            image: "https://randomuser.me/api/portraits/men/99.jpg", // Ảnh mặc định
            lastMessage: "No messages yet",
            lastMessageTime: new Date().toLocaleTimeString(),
            messages: [],
            isGroup: true // 👈 Thêm trường isGroup
        };

        return NextResponse.json(newChat, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong", errorCode: "SERVER_ERROR" },
            { status: 500 }
        );
    }
}