// src/app/user-dashboard/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UserDashboard Page",
  description:
    "This is the user dashboard page where users can view their dashboard.",
};

export default function UserDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-900">
        This is the UserDashboard Page
      </h1>
      <p className="mt-2 text-gray-600">
        Welcome to the user dashboard section.
      </p>
    </div>
  );
}
