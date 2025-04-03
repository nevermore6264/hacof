// src/services/location.service.ts
import { apiService } from "@/services/apiService_v0";
import { Location } from "@/types/entities/location";

class LocationService {
  async getAllLocations(): Promise<Location[]> {
    try {
      const response = await apiService.auth.get<Location[]>(
        "/hackathon-service/api/v1/locations"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve locations");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Location Service] Error getting locations:",
        error.message
      );
      if (
        error.name === "AbortError" &&
        error.message?.includes("component unmounted")
      ) {
        return [] as Location[];
      }
      throw error;
    }
  }

  async createLocation(data: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }): Promise<Location> {
    try {
      const response = await apiService.auth.post<Location>(
        "/hackathon-service/api/v1/locations",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create location");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Location Service] Error creating location:",
        error.message
      );
      throw error;
    }
  }

  async updateLocation(data: {
    id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }): Promise<Location> {
    try {
      const response = await apiService.auth.put<Location>(
        `/hackathon-service/api/v1/locations`,
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update location");
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "[Location Service] Error updating location:",
        error.message
      );
      throw error;
    }
  }
}

export const locationService = new LocationService();
