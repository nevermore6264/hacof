// src/app/forum/thread/[id]/page.tsx
import Image from "next/image";
import { mockForumPosts } from "@/mocks/forumPost.mock";
import { mockUsers } from "@/mocks/auth.mock";

export default function ThreadPage({ params }: { params: { id: string } }) {
  const threadPosts = mockForumPosts.filter(
    (post) => post.threadId === params.id
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Thread Discussion
      </h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {threadPosts.length > 0 ? (
          threadPosts.map((post) => {
            const author = mockUsers.find((user) => user.id === post.authorId);

            return (
              <div
                key={post.id}
                className="bg-white p-4 shadow rounded-lg flex space-x-4"
              >
                {/* Avatar */}
                {author && (
                  <Image
                    src={author.avatarUrl}
                    alt={author.firstName}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                )}

                <div>
                  {/* Author Name & Role */}
                  <p className="text-gray-900 font-semibold">
                    {author?.firstName} {author?.lastName}{" "}
                    <span className="text-sm text-gray-500">
                      ({author?.role})
                    </span>
                  </p>

                  {/* Post Content */}
                  <p className="text-gray-700">{post.content}</p>

                  {/* Timestamp */}
                  <p className="text-gray-500 text-sm mt-1">{post.createdAt}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center">
            No posts available in this thread.
          </p>
        )}
      </div>
    </div>
  );
}
