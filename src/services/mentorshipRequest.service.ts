// src/services/mentorshipRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";

class MentorshipRequestService {
  async createMentorshipRequest(data: {
    hackathonId: string;
    mentorId: string;
    teamId?: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED" | "COMPLETED";
    evaluatedById?: string;
  }): Promise<MentorshipRequest> {
    try {
      const response = await apiService.auth.post<MentorshipRequest>(
        "hackathon-service/api/v1/mentors/request",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create mentorship request"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Mentorship Service] Error creating mentorship request:",
        error.message
      );
      throw error;
    }
  }

  async updateMentorshipRequest(data: {
    id?: string;
    hackathonId: string;
    mentorId: string;
    teamId?: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED" | "COMPLETED";
    evaluatedById?: string;
  }): Promise<MentorshipRequest> {
    try {
      const response = await apiService.auth.put<MentorshipRequest>(
        "hackathon-service/api/v1/mentors/request",
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update mentorship request"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Mentorship Service] Error updating mentorship request:",
        error.message
      );
      throw error;
    }
  }

  async getMentorshipRequestsByTeamAndHackathon(
    teamId: string,
    hackathonId: string
  ): Promise<MentorshipRequest[]> {
    try {
      const response = await apiService.auth.get<MentorshipRequest[]>(
        `/hackathon-service/api/v1/mentorship/filter-by-team-and-hackathon?teamId=${teamId}&hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve mentorship requests");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Mentorship Service] Error fetching mentorship requests:",
        error.message
      );
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return [] as MentorshipRequest[];
      }
      throw error;
    }
  }

  async getMentorshipRequestsByMentorId(
    mentorId: string
  ): Promise<MentorshipRequest[]> {
    try {
      const response = await apiService.auth.get<MentorshipRequest[]>(
        `/hackathon-service/api/v1/mentorship/filter-by-mentor?mentorId=${mentorId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve mentorship requests");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Mentorship Service] Error fetching mentorship requests:",
        error.message
      );
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return [] as MentorshipRequest[];
      }
      throw error;
    }
  }

  async deleteMentorshipRequest(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/mentorship/${id}`
      );

      return {
        message: response.message || "Successfully deleted mentorship request",
      };
    } catch (error: any) {
      console.error(
        "[Mentorship Service] Error deleting mentorship request:",
        error.message
      );
      throw error;
    }
  }
}

export const mentorshipRequestService = new MentorshipRequestService();
