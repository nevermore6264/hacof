// src/services/team.service.ts
import { apiService } from "@/services/apiService_v0";
import { Team } from "@/types/entities/team";

class TeamService {
  async getTeamById(teamId: string): Promise<Partial<Team>> {
    try {
      const response = await apiService.auth.get<Partial<Team>>(
        `/hackathon-service/api/v1/teams/${teamId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching team by ID:", error);
      throw error;
    }
  }
}

export const teamService = new TeamService();
