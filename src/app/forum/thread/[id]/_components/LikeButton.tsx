// src/app/forum/thread/[id]/_components/LikeButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThreadPostLike } from "@/types/entities/threadPostLike";

interface LikeButtonProps {
  postId: string;
  likes: ThreadPostLike[];
  isLoading: boolean;
  currentUsername?: string;
  onLikeAdded: () => void;
  onLikeRemoved: () => void;
}

export default function LikeButton({
  postId,
  likes,
  isLoading,
  currentUsername,
  onLikeAdded,
  onLikeRemoved,
}: LikeButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if current user has liked the post
  const userLike = likes.find(
    (like) => like.createdByUserName === currentUsername
  );
  const hasLiked = !!userLike;

  const handleLikeToggle = async () => {
    if (!currentUsername) {
      alert("You need to be logged in to like posts");
      return;
    }

    setIsProcessing(true);

    try {
      if (hasLiked) {
        // Unlike post
        // Mock delete request
        await new Promise((resolve) => setTimeout(resolve, 300));
        console.log("Removing like:", userLike?.id);
        onLikeRemoved();
      } else {
        // Like post
        const newLike = {
          threadPostId: postId,
          createdByUserName: currentUsername,
        };

        // Mock create request
        await new Promise((resolve) => setTimeout(resolve, 300));
        console.log("Adding like:", newLike);
        onLikeAdded();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center ${hasLiked ? "text-blue-600" : "text-gray-500"} hover:text-blue-600`}
      onClick={handleLikeToggle}
      disabled={isLoading || isProcessing}
    >
      {isLoading || isProcessing ? (
        <span className="flex items-center">
          <div className="h-3 w-3 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
          {likes.length} Likes
        </span>
      ) : (
        <>
          <span className="mr-1">{hasLiked ? "👍" : "👍"}</span>
          <span>
            {likes.length} {likes.length === 1 ? "Like" : "Likes"}
          </span>
        </>
      )}
    </Button>
  );
}
