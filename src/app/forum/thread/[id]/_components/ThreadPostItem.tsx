// src/app/forum/thread/[id]/_components/ThreadPostItem.tsx
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThreadPost } from "@/types/entities/threadPost";
import { fetchMockThreadPostLikes } from "../_mock/fetchMockThreadPostLikes";
import { fetchMockThreadPostReports } from "../_mock/fetchMockThreadPostReports";
import PostForm from "./PostForm";
import LikeButton from "./LikeButton";
import ReportButton from "./ReportButton";

interface ThreadPostItemProps {
  post: ThreadPost;
  currentUsername?: string;
  onPostUpdated: (post: ThreadPost) => void;
  onPostDeleted: (postId: string) => void;
}

export default function ThreadPostItem({
  post,
  currentUsername,
  onPostUpdated,
  onPostDeleted,
}: ThreadPostItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [likes, setLikes] = useState(post.threadPostLikes || []);
  const [reports, setReports] = useState(post.threadPostReports || []);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is the author of the post
  const isAuthor = currentUsername === post.createdByUserName;

  // Load likes and reports data when needed (lazy loading)
  const loadLikes = async () => {
    if (likes.length === 0 && !isLoadingLikes) {
      setIsLoadingLikes(true);
      try {
        const postLikes = await fetchMockThreadPostLikes(post.id);
        setLikes(postLikes);
      } catch (error) {
        console.error("Failed to load likes:", error);
      } finally {
        setIsLoadingLikes(false);
      }
    }
  };

  const loadReports = async () => {
    if (reports.length === 0 && !isLoadingReports) {
      setIsLoadingReports(true);
      try {
        const postReports = await fetchMockThreadPostReports(post.id);
        setReports(postReports);
      } catch (error) {
        console.error("Failed to load reports:", error);
      } finally {
        setIsLoadingReports(false);
      }
    }
  };

  // Handle post edit save
  const handlePostSaved = () => {
    setIsEditing(false);
    // In a real app, you would fetch the updated post or update it locally
    loadLikes();
    loadReports();
  };

  // Handle post deletion
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      setIsDeleting(true);
      try {
        // Mock delete request
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("Deleting post:", post.id);
        onPostDeleted(post.id);
      } catch (error) {
        console.error("Failed to delete post:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Like handlers
  const handleLikeAdded = () => {
    // In a real app, you would update the likes state with the new like
    loadLikes();
  };

  const handleLikeRemoved = () => {
    // In a real app, you would update the likes state by removing the like
    loadLikes();
  };

  // Report handlers
  const handleReportAdded = () => {
    // In a real app, you would update the reports state with the new report
    loadReports();
  };

  return (
    <div
      className="bg-white p-6 shadow-md rounded-lg flex space-x-4"
      onMouseEnter={() => {
        loadLikes();
        loadReports();
      }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="relative h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
          <Image
            src="/default-avatar.png"
            alt={post.createdByUserName || "User"}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex-1">
        {/* Author Name & Timestamp */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-gray-900 font-semibold">
              {post.createdByUserName || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt || Date.now()).toLocaleString()}
            </p>
          </div>

          {/* Post Actions (Edit/Delete) - Only for author */}
          {isAuthor && !post.isDeleted && (
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isDeleting}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting || isEditing}
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-solid border-red-600 border-r-transparent"></div>
                    Deleting
                  </span>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Post Content */}
        {isEditing ? (
          <PostForm
            forumThreadId={post.forumThreadId || ""}
            post={post}
            onPostSaved={handlePostSaved}
            currentUsername={currentUsername}
          />
        ) : (
          <div className="prose prose-sm max-w-none mb-4">
            {post.isDeleted ? (
              <p className="italic text-gray-400">
                This post has been deleted.
              </p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </div>
        )}

        {/* Post Stats & Actions */}
        {!post.isDeleted && !isEditing && (
          <div className="mt-4 flex items-center text-sm text-gray-500 space-x-6">
            <LikeButton
              postId={post.id}
              likes={likes}
              isLoading={isLoadingLikes}
              currentUsername={currentUsername}
              onLikeAdded={handleLikeAdded}
              onLikeRemoved={handleLikeRemoved}
            />

            <ReportButton
              postId={post.id}
              reports={reports}
              isLoading={isLoadingReports}
              currentUsername={currentUsername}
              onReportAdded={handleReportAdded}
            />
          </div>
        )}

        {/* If post is deleted - show deletion info */}
        {post.isDeleted && post.deletedBy && (
          <p className="text-red-500 text-sm mt-2">
            Deleted by {post.deletedBy.firstName} {post.deletedBy.lastName}
          </p>
        )}
      </div>
    </div>
  );
}
