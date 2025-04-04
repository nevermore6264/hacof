// src/app/forum/category/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { mockForumCategories } from "@/mocks/forumCategory.mock";
import { fetchMockThreads } from "./mocks/fetchMockThreads";

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = mockForumCategories.find((cat) => cat.id === params.id);
  if (!category) return notFound();

  // Simulate API fetch
  const categoryThreads = await fetchMockThreads(params.id);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        {category.name}
      </h1>
      <p className="text-gray-700 text-center mb-6">{category.description}</p>

      <div className="max-w-4xl mx-auto space-y-6">
        {categoryThreads.length > 0 ? (
          categoryThreads.map((thread) => (
            <div key={thread.id} className="bg-white p-4 shadow rounded-lg">
              <Link href={`/forum/thread/${thread.id}`}>
                <h2 className="text-lg font-semibold text-blue-600 hover:underline flex items-center">
                  {thread.title}
                  {thread.isPinned && (
                    <span className="ml-2 px-2 py-1 text-xs bg-yellow-300 text-yellow-800 rounded">
                      Pinned
                    </span>
                  )}
                  {thread.isLocked && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-300 text-red-800 rounded">
                      Locked
                    </span>
                  )}
                </h2>
              </Link>
              <p className="text-gray-500 text-sm mt-1">
                Created by {thread.createdByUserName} •{" "}
                {new Date(thread.createdAt ?? "").toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No threads in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
