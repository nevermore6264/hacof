import { NextResponse } from "next/server";

export async function GET(request: Request) {
    console.log("✅ API Route Hit - /api/chats");

    try {
        // 1. Get URL and query params
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        console.log("📌 User ID:", userId);

        // 2. Verify required parameters
        if (!userId) {
            console.error("❌ User ID missing");
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // 3. Get auth token
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            console.error("❌ No authorization header");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 4. Forward to backend API
        const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/conversations/users/${userId}`;
        console.log("🔗 Forwarding to backend:", backendUrl);

        const backendResponse = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader,
            },
        });

        // 5. Handle backend response
        if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            console.error("❌ Backend error:", errorText);
            return NextResponse.json(
                { error: errorText || "Backend error" },
                { status: backendResponse.status }
            );
        }

        const data = await backendResponse.json();
        console.log("📦 Backend response:", data);

        return NextResponse.json(data);
    } catch (error) {
        console.error("❌ Server error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}