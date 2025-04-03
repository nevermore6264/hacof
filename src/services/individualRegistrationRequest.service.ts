// src/services/individualRegistrationRequest.service.ts
import { apiService } from "@/services/apiService_v0";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";

class IndividualRegistrationRequestService {
  async createIndividualRegistrationRequest(data: {
    hackathonId: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    reviewedById?: string;
  }): Promise<IndividualRegistrationRequest> {
    try {
      const response =
        await apiService.auth.post<IndividualRegistrationRequest>(
          "/hackathon-service/api/v1/individuals",
          data
        );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to create registration request"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Individual Registration Service] Error creating registration request:",
        error.message
      );
      throw error;
    }
  }

  async updateIndividualRegistrationRequest(data: {
    id?: string;
    hackathonId: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    reviewedById?: string;
  }): Promise<IndividualRegistrationRequest> {
    try {
      const response = await apiService.auth.put<IndividualRegistrationRequest>(
        `/hackathon-service/api/v1/individuals`,
        data
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to update registration request"
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Individual Registration Service] Error updating registration request:",
        error.message
      );
      throw error;
    }
  }

  async getIndividualRegistrationRequestsByUserAndHackathon(
    createdByUsername: string,
    hackathonId: string
  ): Promise<IndividualRegistrationRequest[]> {
    try {
      const response = await apiService.auth.get<
        IndividualRegistrationRequest[]
      >(
        `/hackathon-service/api/v1/individuals/filter-by-username-and-hackathon?createdByUsername=${createdByUsername}&hackathonId=${hackathonId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve registration requests");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Individual Registration Service] Error fetching registration requests:",
        error.message
      );
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return [] as IndividualRegistrationRequest[];
      }
      throw error;
    }
  }

  async getIndividualRegistrationRequestsByUser(
    createdByUsername: string
  ): Promise<IndividualRegistrationRequest[]> {
    try {
      const response = await apiService.auth.get<
        IndividualRegistrationRequest[]
      >(
        `/hackathon-service/api/v1/individuals/filter-by-username?createdByUsername=${createdByUsername}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve registration requests");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Individual Registration Service] Error fetching registration requests:",
        error.message
      );
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return [] as IndividualRegistrationRequest[];
      }
      throw error;
    }
  }

  async deleteIndividualRegistration(
    id: string
  ): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/individuals/${id}`
      );

      return {
        message: response.message || "Successfully deleted registration",
      };
    } catch (error: any) {
      console.error(
        "[Individual Registration Service] Error deleting registration:",
        error.message
      );
      throw error;
    }
  }
}

export const individualRegistrationRequestService =
  new IndividualRegistrationRequestService();
