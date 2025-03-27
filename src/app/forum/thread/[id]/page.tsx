// src/app/forum/thread/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchMockThreadPosts } from "./_mock/fetchMockThreadPosts";
import { ThreadPost } from "@/types/entities/threadPost";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params?.id as string;

  const [threadPosts, setThreadPosts] = useState<ThreadPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (threadId) {
      fetchMockThreadPosts(threadId).then((posts) => {
        setThreadPosts(posts);
        setLoading(false);
      });
    }
  }, [threadId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading discussions...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Discussion
      </h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {threadPosts.length > 0 ? (
          threadPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 shadow rounded-lg flex space-x-4"
            >
              {/* Avatar (mocked image for now) */}
              <Image
                src="/default-avatar.png"
                alt={post.createdBy.firstName}
                width={50}
                height={50}
                className="rounded-full"
              />

              <div className="flex-1">
                {/* Author Name & Timestamp */}
                <p className="text-gray-900 font-semibold">
                  {post.createdBy.firstName} {post.createdBy.lastName}{" "}
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </p>

                {/* Post Content */}
                <p className="text-gray-700 mt-2">{post.content}</p>

                {/* Post Actions */}
                <div className="flex justify-between mt-3 text-sm text-gray-500">
                  <div>👍 {post.threadPostLikes?.length || 0} Likes</div>
                  <div>🚩 {post.threadPostReports?.length || 0} Reports</div>
                </div>

                {/* If post is deleted */}
                {post.isDeleted && (
                  <p className="text-red-500 text-sm mt-2">
                    Deleted by {post.deletedBy?.firstName}{" "}
                    {post.deletedBy?.lastName}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No discussions available in this thread.
          </p>
        )}
      </div>
    </div>
  );
}
