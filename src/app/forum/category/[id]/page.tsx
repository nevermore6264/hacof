// src/app/forum/category/[id]/page.tsx
import Link from "next/link";
import { mockForumThreads } from "@/mocks/forumThread.mock";

export default function CategoryPage({ params }: { params: { id: string } }) {
  const categoryThreads = mockForumThreads.filter(
    (thread) => thread.categoryId === params.id
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Threads
      </h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {categoryThreads.map((thread) => (
          <div key={thread.id} className="bg-white p-4 shadow rounded-lg">
            <Link href={`/forum/thread/${thread.id}`}>
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                {thread.title}
              </h2>
            </Link>
            <p className="text-gray-500 text-sm">
              by User {thread.authorId} • {thread.createdAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
