// src/services/scheduleEvent.service.ts
import { apiService } from "@/services/apiService_v0";
import { ScheduleEvent } from "@/types/entities/scheduleEvent";
import { handleApiError } from "@/utils/errorHandler";

class ScheduleEventService {
  async createScheduleEvent(data: {
    scheduleId: string;
    name: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    isRecurring?: boolean;
    recurrenceRule?: string;
  }): Promise<{ data: ScheduleEvent; message?: string }> {
    try {
      const response = await apiService.auth.post<ScheduleEvent>(
        "/communication-service/api/v1/schedule-events",
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create schedule event");
      }

      return {
        data: response.data,
        message: response.message || "Schedule event created successfully",
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent>(
        error,
        {} as ScheduleEvent,
        "[Schedule Event Service] Error creating schedule event:"
      );
    }
  }

  async updateScheduleEvent(
    id: string,
    data: {
      scheduleId: string;
      name: string;
      description: string;
      location: string;
      startTime: string;
      endTime: string;
      isRecurring?: boolean;
      recurrenceRule?: string;
      fileUrls: string[];
    }
  ): Promise<{ data: ScheduleEvent; message?: string }> {
    try {
      const response = await apiService.auth.put<ScheduleEvent>(
        `/communication-service/api/v1/schedule-events/${id}`,
        data
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update schedule event");
      }

      return {
        data: response.data,
        message: response.message || "Schedule event updated successfully",
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent>(
        error,
        {} as ScheduleEvent,
        "[Schedule Event Service] Error updating schedule event:"
      );
    }
  }

  async deleteScheduleEvent(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/communication-service/api/v1/schedule-events/${id}`
      );

      return {
        message: response.message || "Schedule event deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[Schedule Event Service] Error deleting schedule event:",
        error.message
      );
      throw error;
    }
  }

  async getScheduleEventById(
    id: string
  ): Promise<{ data: ScheduleEvent; message?: string }> {
    try {
      const response = await apiService.auth.get<ScheduleEvent>(
        `/communication-service/api/v1/schedule-events/${id}`
      );

      if (!response || !response.data) {
        throw new Error(
          response?.message || "Failed to retrieve schedule event"
        );
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent>(
        error,
        {} as ScheduleEvent,
        "[Schedule Event Service] Error getting schedule event:"
      );
    }
  }

  async getAllScheduleEvents(): Promise<{
    data: ScheduleEvent[];
    message?: string;
  }> {
    try {
      const response = await apiService.auth.get<ScheduleEvent[]>(
        "/communication-service/api/v1/schedule-events"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve schedule events");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent[]>(
        error,
        [],
        "[Schedule Event Service] Error getting schedule events:"
      );
    }
  }

  async getScheduleEventsByScheduleId(
    scheduleId: string
  ): Promise<{ data: ScheduleEvent[]; message?: string }> {
    try {
      const response = await apiService.auth.get<ScheduleEvent[]>(
        `/communication-service/api/v1/schedule-events/by-schedule/${scheduleId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve schedule events by schedule ID");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<ScheduleEvent[]>(
        error,
        [],
        "[Schedule Event Service] Error getting schedule events by schedule ID:"
      );
    }
  }
}

export const scheduleEventService = new ScheduleEventService();
