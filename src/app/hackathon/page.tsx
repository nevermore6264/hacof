// src/app/hackathon/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathon Page",
  description:
    "This is the hackathon page where users can participate in hackathons.",
};

export default function HackathonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-900">
        This is the Hackathon Page
      </h1>
      <p className="mt-2 text-gray-600">Welcome to the hackathon section.</p>
    </div>
  );
}
