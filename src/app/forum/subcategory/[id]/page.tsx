// src/app/forum/subcategory/[id]/page.tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forum Subcategory",
  description: "Explore threads in this subcategory.",
};

// Dummy Data
const threads = {
  "101": [
    {
      id: "1001",
      title: "Hackathon 2025 Announced!",
      author: "admin",
      createdAt: "Today",
    },
  ],
  "102": [
    {
      id: "1002",
      title: "Feedback on Last Hackathon",
      author: "judge123",
      createdAt: "Yesterday",
    },
  ],
  "201": [
    {
      id: "1003",
      title: "Looking for a frontend developer!",
      author: "user42",
      createdAt: "1 hour ago",
    },
  ],
};

export default function SubcategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const subcategoryId = params.id;
  const subcategoryThreads = threads[subcategoryId] || [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Threads
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {subcategoryThreads.map((thread) => (
          <div key={thread.id} className="bg-white p-4 shadow rounded-lg">
            <Link href={`/forum/thread/${thread.id}`}>
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                {thread.title}
              </h2>
            </Link>
            <p className="text-gray-500 text-sm">
              by {thread.author} • {thread.createdAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
