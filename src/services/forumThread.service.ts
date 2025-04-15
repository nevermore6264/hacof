// src/services/forumThread.service.ts
import { ForumThread } from "@/types/entities/forumThread";
import { apiService } from "@/services/apiService_v0";
import { handleApiError } from "@/utils/errorHandler";

class ForumThreadService {
  async createForumThread(data: {
    title: string;
    forumCategoryId: string;
    isLocked: boolean;
    isPinned: boolean;
  }): Promise<{ data: ForumThread; message?: string }> {
    try {
      const response = await apiService.auth.post<ForumThread>(
        "/communication-service/api/v1/forum-threads",
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create forum thread");
      }

      return {
        data: response.data,
        message: response.message || "Forum thread created successfully",
      };
    } catch (error: any) {
      return handleApiError<ForumThread>(
        error,
        {} as ForumThread,
        "[Forum Thread Service] Error creating forum thread:"
      );
    }
  }

  async getAllForumThreads(): Promise<{
    data: ForumThread[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<ForumThread[]>(
        "/communication-service/api/v1/forum-threads"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve forum threads");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ForumThread[]>(
        error,
        [],
        "[Forum Thread Service] Error getting forum threads:"
      );
    }
  }

  async getForumThreadById(
    id: string
  ): Promise<{ data: ForumThread; message?: string }> {
    try {
      const response = await apiService.auth.get<ForumThread>(
        `/communication-service/api/v1/forum-threads/${id}`
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to retrieve forum thread");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ForumThread>(
        error,
        {} as ForumThread,
        "[Forum Thread Service] Error getting forum thread:"
      );
    }
  }

  async getForumThreadsByCategoryId(
    forumCategoryId: string
  ): Promise<{ data: ForumThread[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ForumThread[]>(
        `/communication-service/api/v1/forum-threads/category/${forumCategoryId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve forum threads by category ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ForumThread[]>(
        error,
        [],
        "[Forum Thread Service] Error getting forum threads by category ID:"
      );
    }
  }

  async updateForumThread(
    id: string,
    data: {
      title: string;
      forumCategoryId: string;
      isLocked: boolean;
      isPinned: boolean;
    }
  ): Promise<{ data: ForumThread; message?: string }> {
    try {
      const response = await apiService.auth.put<ForumThread>(
        `/communication-service/api/v1/forum-threads/${id}`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update forum thread");
      }

      return {
        data: response.data,
        message: response.message || "Forum thread updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ForumThread>(
        error,
        {} as ForumThread,
        "[Forum Thread Service] Error updating forum thread:"
      );
    }
  }

  async deleteForumThread(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/forum-threads/${id}`
      );

      return {
        message: response.message || "Forum thread deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Forum Thread Service] Error deleting forum thread:",
        error.message
      );
      throw error;
    }
  }
}

export const forumThreadService = new ForumThreadService();
