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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/forum" className="hover:text-indigo-600 transition">
            Forum
          </Link>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
          <span className="font-medium text-gray-900">{category.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="mt-2 text-gray-600">{category.description}</p>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {categoryThreads.length} thread
              {categoryThreads.length !== 1 ? "s" : ""}
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
              New Thread
            </button>
          </div>
        </div>

        {/* Thread List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {categoryThreads.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {categoryThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={`p-6 hover:bg-gray-50 transition duration-150 ${
                    thread.isPinned ? "bg-amber-50" : ""
                  }`}
                >
                  <Link href={`/forum/thread/${thread.id}`} className="group">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center">
                          <h2 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition">
                            {thread.title}
                          </h2>
                          <div className="flex space-x-2 ml-3">
                            {thread.isPinned && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Pinned
                              </span>
                            )}
                            {thread.isLocked && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Locked
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4">
                          <div className="flex items-center text-sm">
                            <div className="flex-shrink-0 mr-1.5">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                                {thread.createdByUserName.charAt(0)}
                              </div>
                            </div>
                            <div className="text-gray-500">
                              {thread.createdByUserName}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(thread.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No threads yet
              </h3>
              <p className="text-gray-500">
                Be the first to start a discussion in this category
              </p>
              <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Create New Thread
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
