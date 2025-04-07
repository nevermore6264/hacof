/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");

        if (!code) {
            return NextResponse.json(
                { error: "No code provided" },
                { status: 400 }
            );
        }

        // Send code to backend
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/auth/outbound/authentication?code=${code}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Backend error:", error);
            return NextResponse.json(error, { status: response.status });
        }

        const data = await response.json();
        console.log("Authentication successful:", data);

        // Check if user needs to create password
        const passwordResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/users/create-password`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${data.token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            }
        );

        // If password exists, redirect to home
        if (passwordResponse.status === 400) {
            const error = await passwordResponse.json();
            if (error.code === "PASSWORD_EXISTED") {
                // Store token in localStorage
                const script = `
                    <script>
                        localStorage.setItem('token', '${data.token}');
                        window.location.href = '/';
                    </script>
                `;
                return new NextResponse(script, {
                    headers: { 'Content-Type': 'text/html' },
                });
            }
        }

        // If password doesn't exist, redirect to create password page
        const script = `
            <script>
                localStorage.setItem('token', '${data.token}');
                window.location.href = '/create-password';
            </script>
        `;
        return new NextResponse(script, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 