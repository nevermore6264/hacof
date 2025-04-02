// src/services/mentorshipSessionRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";

type MentorshipSessionRequestPayload = {
  mentorTeamId: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED" | "COMPLETED";
  evaluatedById?: string;
  evaluatedAt?: string;
};

class MentorshipSessionRequestService {
  async createMentorshipSessionRequest(
    data: MentorshipSessionRequestPayload
  ): Promise<MentorshipSessionRequest> {
    try {
      const response = await apiService.auth.post<MentorshipSessionRequest>(
        "/hackathon-service/api/v1/mentors/sessions/request",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating Mentorship Session Request:", error);
      throw error;
    }
  }
}

export const mentorshipSessionRequestService =
  new MentorshipSessionRequestService();
