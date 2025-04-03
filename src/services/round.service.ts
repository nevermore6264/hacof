// src/services/round.service.ts
import { apiService } from "@/services/apiService_v0";
import { Round } from "@/types/entities/round";

class RoundService {
  async createRound(data: {
    hackathonId: string;
    startTime: string;
    endTime: string;
    roundNumber: number;
    roundTitle: string;
    status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
    roundLocations?: string[];
  }): Promise<Round> {
    try {
      const response = await apiService.auth.post<Round>(
        "/hackathon-service/api/v1/rounds",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create round");
      }

      return response.data;
    } catch (error: any) {
      console.error("[Round Service] Error creating round:", error.message);
      throw error;
    }
  }

  async updateRound(data: {
    id?: string;
    hackathonId: string;
    startTime: string;
    endTime: string;
    roundNumber: number;
    roundTitle: string;
    status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
    roundLocations?: string[];
  }): Promise<Round> {
    try {
      const response = await apiService.auth.put<Round>(
        `/hackathon-service/api/v1/rounds`,
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update round");
      }

      return response.data;
    } catch (error: any) {
      console.error("[Round Service] Error updating round:", error.message);
      throw error;
    }
  }

  async getRoundsByHackathonId(hackathonId: string): Promise<Round[]> {
    try {
      const response = await apiService.auth.get<Round[]>(
        `/hackathon-service/api/v1/rounds?hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve rounds");
      }

      return response.data;
    } catch (error: any) {
      console.error("[Round Service] Error fetching rounds:", error.message);
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return [] as Round[];
      }
      throw error;
    }
  }
}

export const roundService = new RoundService();
