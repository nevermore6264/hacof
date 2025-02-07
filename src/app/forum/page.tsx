// src/app/forum/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forum Page",
  description: "This is the forum page where users can discuss topics.",
};

export default function ForumPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-900">
        This is the Forum Page
      </h1>
      <p className="mt-2 text-gray-600">Welcome to the forum section.</p>
    </div>
  );
}
