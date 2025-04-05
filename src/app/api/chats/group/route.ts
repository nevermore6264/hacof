import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/conversations/group`, // 👈 Endpoint backend
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader,
                },
                body: JSON.stringify(await req.json()),
            }
        );

        const data = await backendResponse.json();
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error },
            { status: 500 }
        );
    }
}
