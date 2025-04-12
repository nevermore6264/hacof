// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskComments.tsx
"use client";

import { useState } from "react";
import { TaskComment } from "@/types/entities/taskComment";
import { formatDistance } from "date-fns";
import { taskCommentService } from "@/services/taskComment.service";

interface TaskCommentsProps {
  comments: TaskComment[];
  taskId: string;
  onAddComment?: (comment: TaskComment) => void;
  onError?: (error: string) => void;
}

export default function TaskComments({
  comments,
  taskId,
  onAddComment,
  onError,
}: TaskCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data: createdComment } =
        await taskCommentService.createTaskComment({
          taskId,
          content: newComment.trim(),
        });

      if (createdComment && onAddComment) {
        onAddComment(createdComment);
      }

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      if (onError) onError("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="mr-2">💬</span>
        Comments
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] text-sm"
          disabled={isSubmitting}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? "Adding..." : "Add Comment"}
          </button>
        </div>
      </form>

      {/* Comment list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-3 rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                {/* Use actual avatar and username if available */}
                <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                <span className="text-sm font-medium">
                  {comment.createdByUserName || "User"}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatDistance(new Date(comment.createdAt || ""), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-gray-500 italic text-center">
            No comments yet
          </p>
        )}
      </div>
    </div>
  );
}
