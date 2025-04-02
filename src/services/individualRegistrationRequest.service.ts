// src/services/individualRegistrationRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";

type IndividualRegistrationRequestPayload = {
  id?: string;
  hackathonId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedById?: string;
};

class IndividualRegistrationRequestService {
  async createIndividualRegistrationRequest(
    data: IndividualRegistrationRequestPayload
  ): Promise<IndividualRegistrationRequest> {
    try {
      const response =
        await apiService.auth.post<IndividualRegistrationRequest>(
          "/hackathon-service/api/v1/individuals",
          data
        );
      return response.data;
    } catch (error) {
      console.error("Error creating Individual Registration Request:", error);
      throw error;
    }
  }

  async updateIndividualRegistrationRequest(
    data: IndividualRegistrationRequestPayload
  ): Promise<IndividualRegistrationRequest> {
    try {
      const response = await apiService.auth.put<IndividualRegistrationRequest>(
        `/hackathon-service/api/v1/individuals`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Individual Registration Request:", error);
      throw error;
    }
  }
}

export const individualRegistrationRequestService =
  new IndividualRegistrationRequestService();
