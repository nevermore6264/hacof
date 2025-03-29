// src/app/forum/thread/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchMockThreadPosts } from "./_mock/fetchMockThreadPosts";
import { ThreadPost } from "@/types/entities/threadPost";
import EditForm from "./_components/EditForm";
import { Button } from "@/components/ui/button";
import "./style.scss";

export default function ThreadPage() {
  const params = useParams();
  const threadId = params?.id as string;

  const [threadPosts, setThreadPosts] = useState<ThreadPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Fetch posts for the thread
  const fetchPosts = async () => {
    setLoading(true);
    const posts = await fetchMockThreadPosts(threadId);
    setThreadPosts(posts);
    setLoading(false);
  };

  useEffect(() => {
    if (threadId) {
      fetchPosts();
    }
  }, [threadId]);

  // Handle post save (refresh list after creating/editing)
  const handlePostSaved = () => {
    setEditingPostId(null);
    fetchPosts();
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading discussions...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Discussion
      </h1>
      {/* New Post Form */}
      <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Start a New Discussion
        </h2>
        <EditForm onPostSaved={handlePostSaved} />
      </div>

      {/* Discussion Posts */}
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
                {editingPostId === post.id ? (
                  <EditForm post={post} onPostSaved={handlePostSaved} />
                ) : (
                  <p className="text-gray-700 mt-2">{post.content}</p>
                )}

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

                {/* Edit Button (Only for the current user) */}
                {!post.isDeleted && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingPostId(
                          editingPostId === post.id ? null : post.id
                        )
                      }
                    >
                      {editingPostId === post.id ? "Cancel" : "Edit"}
                    </Button>
                  </div>
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
