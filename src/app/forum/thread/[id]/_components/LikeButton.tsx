// src/app/forum/thread/[id]/_components/LikeButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { threadPostLikeService } from "@/services/threadPostLike.service";
import { ThreadPostLike } from "@/types/entities/threadPostLike";

interface LikeButtonProps {
  threadPostId: string;
  initialLikes?: ThreadPostLike[];
}

export default function LikeButton({
  threadPostId,
  initialLikes = [],
}: LikeButtonProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState<ThreadPostLike[]>(initialLikes);
  const [loading, setLoading] = useState(false);
  const [userLike, setUserLike] = useState<ThreadPostLike | null>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response =
          await threadPostLikeService.getLikesByThreadPostId(threadPostId);
        setLikes(response.data);

        // Check if current user has liked this post
        if (user) {
          const currentUserLike = response.data.find(
            (like) => like.createdByUserName === user.username
          );
          setUserLike(currentUserLike || null);
        }
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      }
    };

    fetchLikes();
  }, [threadPostId, user]);

  const handleLikeToggle = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (userLike) {
        // Unlike: remove the like
        await threadPostLikeService.deleteThreadPostLike(userLike.id);
        setLikes((prev) => prev.filter((like) => like.id !== userLike.id));
        setUserLike(null);
      } else {
        // Like: add a new like
        const response = await threadPostLikeService.createThreadPostLike({
          threadPostId,
        });

        if (response.data) {
          setLikes((prev) => [...prev, response.data]);
          setUserLike(response.data);
        }
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={loading || !user}
      className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
        userLike
          ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
          : "text-gray-600 hover:bg-gray-100"
      } ${!user ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      title={user ? "Like this post" : "Sign in to like posts"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={userLike ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
      </svg>
      <span>{likes.length}</span>
      {loading && (
        <svg
          className="animate-spin h-3 w-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </button>
  );
}
