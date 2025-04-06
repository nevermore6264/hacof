// src/app/forum/thread/[id]/_components/PostForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThreadPost } from "@/types/entities/threadPost";

interface PostFormProps {
  forumThreadId: string;
  post?: ThreadPost;
  onPostSaved: () => void;
  currentUsername?: string;
}

export default function PostForm({
  forumThreadId,
  post,
  onPostSaved,
  currentUsername,
}: PostFormProps) {
  const [content, setContent] = useState(post?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      if (post) {
        // Update existing post
        const updatedPost = {
          ...post,
          content,
        };

        // Mock update request
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("Updating post:", updatedPost);
      } else {
        // Create new post
        const newPost = {
          forumThreadId,
          content,
          isDeleted: false,
          createdByUserName: currentUsername || "Anonymous User",
        };

        // Mock create request
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("Creating post:", newPost);
      }

      // Reset form and notify parent
      setContent("");
      onPostSaved();
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-32"
          placeholder="Write your thoughts here..."
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
              </span>
              {post ? "Updating..." : "Posting..."}
            </>
          ) : post ? (
            "Update Post"
          ) : (
            "Post"
          )}
        </Button>
      </div>
    </form>
  );
}
