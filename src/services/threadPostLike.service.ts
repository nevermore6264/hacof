// src/services/threadPostLike.service.ts
import { apiService } from "@/services/apiService_v0";
import { ThreadPostLike } from "@/types/entities/threadPostLike";
import { handleApiError } from "@/utils/errorHandler";

class ThreadPostLikeService {
  async getAllThreadPostLikes(): Promise<{
    data: ThreadPostLike[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<ThreadPostLike[]>(
        "/communication-service/api/v1/thread-post-likes"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve thread post likes");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ThreadPostLike[]>(
        error,
        [],
        "[Thread Post Like Service] Error getting thread post likes:"
      );
    }
  }

  async getThreadPostLike(
    id: string
  ): Promise<{ data: ThreadPostLike; message?: string }> {
    try {
      const response = await apiService.auth.get<ThreadPostLike>(
        `/communication-service/api/v1/thread-post-likes/${id}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve thread post like"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ThreadPostLike>(
        error,
        {} as ThreadPostLike,
        "[Thread Post Like Service] Error getting thread post like:"
      );
    }
  }

  async getLikesByThreadPostId(
    threadPostId: string
  ): Promise<{ data: ThreadPostLike[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ThreadPostLike[]>(
        `/communication-service/api/v1/thread-post-likes/thread-post/${threadPostId}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve likes by thread post ID"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ThreadPostLike[]>(
        error,
        [],
        "[Thread Post Like Service] Error getting likes by thread post ID:"
      );
    }
  }

  async createThreadPostLike(data: {
    threadPostId: string;
  }): Promise<{ data: ThreadPostLike; message?: string }> {
    try {
      const response = await apiService.auth.post<ThreadPostLike>(
        "/communication-service/api/v1/thread-post-likes",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create thread post like"
        );
      }

      return {
        data: response.data,
        message: response.message || "Thread post like created successfully",
      };
    } catch (error: any) {
      return handleApiError<ThreadPostLike>(
        error,
        {} as ThreadPostLike,
        "[Thread Post Like Service] Error creating thread post like:"
      );
    }
  }

  async deleteThreadPostLike(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/thread-post-likes/${id}`
      );

      return {
        message: response.message || "Thread post like deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Thread Post Like Service] Error deleting thread post like:",
        error.message
      );
      throw error;
    }
  }
}

export const threadPostLikeService = new ThreadPostLikeService();
