import { apiService } from "@/services/apiService_v0";
import { Submission } from "@/types/entities/submission";
import { tokenService_v0 } from "@/services/token.service_v0";
import { handleApiError } from "@/utils/errorHandler";

class SubmissionService {
  async getSubmissionsByRoundAndCreator(
    roundId: string,
    createdByUsername: string
  ): Promise<{ data: Submission[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Submission[]>(
        `/submission-service/api/v1/submissions/by-round-created?roundId=${roundId}&createdByUsername=${createdByUsername}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve submissions");
      }

      return {
        data: response.data,
        message: response.message || "Submissions retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Submission[]>(
        error,
        [],
        "[Submission Service] Error fetching submissions by round and creator:"
      );
    }
  }

  async getSubmissionsByTeamAndRound(
    teamId: string,
    roundId: string
  ): Promise<{ data: Submission[]; message?: string }> {
    try {
      const response = await apiService.auth.get<Submission[]>(
        `/submission-service/api/v1/submissions/by-team-round?teamId=${teamId}&roundId=${roundId}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve submissions");
      }

      return {
        data: response.data,
        message: response.message || "Submissions retrieved successfully",
      };
    } catch (error: any) {
      return handleApiError<Submission[]>(
        error,
        [],
        "[Submission Service] Error fetching submissions by team and round:"
      );
    }
  }

  async createSubmissionWithFiles(
    files: File[],
    roundId: string,
    teamId: string,
    status: "DRAFT" | "SUBMITTED" | "REVIEWED"
  ): Promise<{ data: Submission; message?: string }> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("roundId", roundId);
      formData.append("teamId", teamId);
      formData.append("status", status);

      const response = await fetch("/submission-service/api/v1/submissions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Upload failed: ${errMsg}`);
      }

      const data = (await response.json()) as Submission;
      return {
        data,
        message: "Submission created successfully",
      };
    } catch (error: any) {
      console.error(
        "[Submission Service] Error uploading submission:",
        error.message
      );
      throw error;
    }
  }

  async updateSubmissionWithFiles(
    submissionId: string,
    files: File[],
    roundId: string,
    teamId: string,
    status: "DRAFT" | "SUBMITTED" | "REVIEWED"
  ): Promise<{ data: Submission; message?: string }> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("roundId", roundId);
      formData.append("teamId", teamId);
      formData.append("status", status);

      const response = await fetch(
        `/submission-service/api/v1/submissions/${submissionId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Update failed: ${errMsg}`);
      }

      const data = (await response.json()) as Submission;
      return {
        data,
        message: "Submission updated successfully",
      };
    } catch (error: any) {
      console.error(
        "[Submission Service] Error updating submission:",
        error.message
      );
      throw error;
    }
  }
}

export const submissionService = new SubmissionService();
