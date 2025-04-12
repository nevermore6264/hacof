// src/services/forumCategory.service.ts
import { ForumCategory } from "@/types/entities/forumCategory";
import { apiService } from "@/services/apiService_v0";
import { handleApiError } from "@/utils/errorHandler";

class ForumCategoryService {
  async createForumCategory(data: {
    name: string;
    description?: string;
    section: string;
  }): Promise<{ data: ForumCategory; message?: string }> {
    try {
      const response = await apiService.auth.post<ForumCategory>(
        "/communication-service/api/v1/forum-categories",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create forum category");
      }

      return {
        data: response.data,
        message: response.message || "Forum category created successfully",
      };
    } catch (error: any) {
      return handleApiError<ForumCategory>(
        error,
        {} as ForumCategory,
        "[Forum Category Service] Error creating forum category:"
      );
    }
  }

  async getAllForumCategories(): Promise<{
    data: ForumCategory[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<ForumCategory[]>(
        "/communication-service/api/v1/forum-categories"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve forum categories");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ForumCategory[]>(
        error,
        [],
        "[Forum Category Service] Error getting forum categories:"
      );
    }
  }

  async getForumCategoryById(
    id: string
  ): Promise<{ data: ForumCategory; message?: string }> {
    try {
      const response = await apiService.auth.get<ForumCategory>(
        `/communication-service/api/v1/forum-categories/${id}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve forum category"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ForumCategory>(
        error,
        {} as ForumCategory,
        "[Forum Category Service] Error getting forum category:"
      );
    }
  }

  async updateForumCategory(
    id: string,
    data: {
      name: string;
      description?: string;
      section: string;
    }
  ): Promise<{ data: ForumCategory; message?: string }> {
    try {
      const response = await apiService.auth.put<ForumCategory>(
        `/communication-service/api/v1/forum-categories/${id}`,
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update forum category");
      }

      return {
        data: response.data,
        message: response.message || "Forum category updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ForumCategory>(
        error,
        {} as ForumCategory,
        "[Forum Category Service] Error updating forum category:"
      );
    }
  }

  async deleteForumCategory(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/forum-categories/${id}`
      );

      return {
        message: response.message || "Forum category deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Forum Category Service] Error deleting forum category:",
        error.message
      );
      throw error;
    }
  }
}

export const forumCategoryService = new ForumCategoryService();
