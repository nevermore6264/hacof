// src/services/teamRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { TeamRequest } from "@/types/entities/teamRequest";

class TeamRequestService {
  async getTeamRequestsByHackathonAndUser(
    hackathonId: string,
    memberId: string
  ): Promise<TeamRequest[]> {
    try {
      const response = await apiService.auth.get<TeamRequest[]>(
        `/hackathon-service/api/v1/teams/requests?memberId=${memberId}&hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team requests");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Team Request Service] Error fetching team requests:",
        error.message
      );
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return [] as TeamRequest[];
      }
      throw error;
    }
  }

  async getTeamRequestsByUser(memberId: string): Promise<TeamRequest[]> {
    try {
      const response = await apiService.auth.get<TeamRequest[]>(
        `/hackathon-service/api/v1/teams/requests?memberId=${memberId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team requests");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Team Request Service] Error fetching team requests:",
        error.message
      );
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return [] as TeamRequest[];
      }
      throw error;
    }
  }

  async getTeamRequestsByHackathon(
    hackathonId: string
  ): Promise<TeamRequest[]> {
    try {
      const response = await apiService.auth.get<TeamRequest[]>(
        `/hackathon-service/api/v1/teams/requests?hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve team requests");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Team Request Service] Error fetching team requests:",
        error.message
      );
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return [] as TeamRequest[];
      }
      throw error;
    }
  }

  async createTeamRequest(data: {
    hackathonId: string;
    name: string;
    note: string;
    teamRequestMembers: {
      userId: string;
    }[];
  }): Promise<TeamRequest> {
    try {
      const response = await apiService.auth.post<TeamRequest>(
        "/hackathon-service/api/v1/teams/requests",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create team request");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Team Request Service] Error creating team request:",
        error.message
      );
      throw error;
    }
  }

  async reviewTeamRequest(data: {
    requestId: string;
    status: "APPROVED" | "REJECTED";
    note: string;
  }): Promise<TeamRequest> {
    try {
      const response = await apiService.auth.post<TeamRequest>(
        "/hackathon-service/api/v1/teams/requests/review",
        { data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to review team request");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Team Request Service] Error reviewing team request:",
        error.message
      );
      throw error;
    }
  }

  async deleteTeamRequest(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete<void>(
        `/hackathon-service/api/v1/teams/requests/${id}`
      );

      return {
        message: response.message || "Successfully deleted team request",
      };
    } catch (error: any) {
      console.error(
        "[Team Request Service] Error deleting team request:",
        error.message
      );
      throw error;
    }
  }
}

export const teamRequestService = new TeamRequestService();
