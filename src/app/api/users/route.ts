// src/app/api/user/route.ts
import { NextResponse } from "next/server";

// Định nghĩa kiểu dữ liệu cho user
interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    // Các trường khác nếu cần
}

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

        // Lấy token từ header
        const token = authHeader.split(" ")[1];

        // Gọi API backend thực
        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Kiểm tra response từ backend
        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            return NextResponse.json(
                {
                    error: errorData
                },
                { status: backendResponse.status }
            );
        }

        // Parse dữ liệu từ backend
        const backendUsers: User[] = await backendResponse.json();

        // Format dữ liệu để trả về client (loại bỏ thông tin nhạy cảm)
        const users = backendUsers.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            image: user.avatarUrl || null,
        }));

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            {
                error: "Error fetching users: " + error,
                errorCode: "SERVER_ERROR"
            },
            { status: 500 }
        );
    }
}