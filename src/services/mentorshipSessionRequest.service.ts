// src/services/mentorshipSessionRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";

class MentorshipSessionRequestService {
  async createMentorshipSessionRequest(data: {
    mentorTeamId: string;
    startTime: string;
    endTime: string;
    location: string;
    description?: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED" | "COMPLETED";
    evaluatedById?: string;
    evaluatedAt?: string;
  }): Promise<MentorshipSessionRequest> {
    try {
      const response = await apiService.auth.post<MentorshipSessionRequest>(
        "/hackathon-service/api/v1/mentors/sessions",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create mentorship session request"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Mentorship Session Service] Error creating mentorship session:",
        error.message
      );
      throw error;
    }
  }

  async updateMentorshipSessionRequest(data: {
    id?: string;
    mentorTeamId: string;
    startTime: string;
    endTime: string;
    location: string;
    description?: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED" | "COMPLETED";
    evaluatedById?: string;
    evaluatedAt?: string;
  }): Promise<MentorshipSessionRequest> {
    try {
      const response = await apiService.auth.put<MentorshipSessionRequest>(
        `/hackathon-service/api/v1/mentorship/sessions`,
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update mentorship session request"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Mentorship Session Service] Error updating mentorship session:",
        error.message
      );
      throw error;
    }
  }

  async getMentorshipSessionRequestsByMentorTeamId(
    mentorTeamId: string
  ): Promise<MentorshipSessionRequest[]> {
    try {
      const response = await apiService.auth.get<MentorshipSessionRequest[]>(
        `/hackathon-service/api/v1/mentorship/sessions/filter-by-mentor-team?mentorTeamId=${mentorTeamId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve mentorship session requests");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Mentorship Session Service] Error fetching mentorship sessions:",
        error.message
      );
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return [] as MentorshipSessionRequest[];
      }
      throw error;
    }
  }

  async deleteMentorshipSessionRequest(
    id: string
  ): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/mentorship/sessions/${id}`
      );

      return {
        message: response.message || "Successfully deleted mentorship session",
      };
    } catch (error: any) {
      console.error(
        "[Mentorship Session Service] Error deleting mentorship session:",
        error.message
      );
      throw error;
    }
  }
}

export const mentorshipSessionRequestService =
  new MentorshipSessionRequestService();
