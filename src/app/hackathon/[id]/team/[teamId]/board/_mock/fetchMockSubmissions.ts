// src/app/hackathon/[id]/team/[teamId]/board/_mock/fetchMockSubmissions.ts
import { Submission, SubmissionStatus } from "@/types/entities/submission";

export const fetchMockSubmissions = (
  roundId: string,
  createdById: string
): Promise<Submission[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockSubmissions: Submission[] = [
        {
          id: "submission1",
          round: {
            id: roundId,
            roundTitle: "Idea Submission",
          },
          fileUrls: [
            {
              id: "file1",
              fileName: "proposal.pdf",
              fileUrl: "https://example.com/proposal.pdf",
              fileType: "pdf",
              fileSize: 204800,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          judgeSubmissions: [
            {
              id: "judgeSubmission1",
              judge: {
                id: "judge1",
                firstName: "User X",
                lastName: "User Y",
              },
              score: 85,
              note: "Good idea execution",
              judgeSubmissionDetails: [
                {
                  id: "detail1",
                  score: 40,
                  note: "Great concept",
                  roundMarkCriterion: {
                    id: "criterion1",
                    name: "Creativity",
                    maxScore: 50,
                    note: "Measures innovation",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          status: "SUBMITTED",
          submittedAt: new Date().toISOString(),
          finalScore: 85,
          createdBy: {
            id: createdById,
            firstName: "User X",
            lastName: "User Y",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "submission2",
          round: {
            id: roundId,
            roundTitle: "Idea Submission",
          },
          fileUrls: [
            {
              id: "file2",
              fileName: "prototype.mp4",
              fileUrl: "https://example.com/prototype.mp4",
              fileType: "mp4",
              fileSize: 10485760,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          judgeSubmissions: [],
          status: "DRAFT",
          submittedAt: "",
          createdBy: {
            id: createdById,
            firstName: "User X",
            lastName: "User Y",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockSubmissions);
    }, 500);
  });
};
