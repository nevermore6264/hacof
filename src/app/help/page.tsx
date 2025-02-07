// src/app/help/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Page",
  description: "This is the help page where users can get help.",
};

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-900">
        This is the Help Page
      </h1>
      <p className="mt-2 text-gray-600">Welcome to the help section.</p>
    </div>
  );
}
