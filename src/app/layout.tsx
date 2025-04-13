// src/app/layout.tsx
"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "../styles/index.css";
import { useAuth } from "@/hooks/useAuth_v0";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { WebSocketProvider } from '@/contexts/WebSocketContext';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkUser } = useAuth();
  useEffect(() => {
    console.log("🔹 AuthProvider: Initializing auth check");
    checkUser(); // No need to check accessToken separately
  }, []);

  return (
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`min-h-screen flex flex-col bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <WebSocketProvider>
          <Providers>
            <Header />
            <main className="flex-1 pt-[142px]">
              {children}
            </main>
            <Toaster position="top-center" richColors />
            <Footer />
            <ScrollToTop />
          </Providers>
        </WebSocketProvider>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
