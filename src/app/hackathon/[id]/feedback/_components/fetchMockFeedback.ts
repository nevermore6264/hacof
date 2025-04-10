// src/app/hackathon/[id]/team/[teamId]/board/_mock/fetchMockFeedback.ts
import { Feedback } from "@/types/entities/feedback";

export const fetchMockFeedbackByCreatedUser = (
  createdByUserName: string
): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockFeedback: Feedback[] = [
        {
          id: "feedback1",
          createdByUserName,
          hackathonId: "hackathon1",
          mentorId: "mentor1",
          teamId: "team1",
          feedbackDetails: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "feedback2",
          createdByUserName,
          hackathonId: "hackathon2",
          mentorId: "mentor2",
          teamId: "team2",
          feedbackDetails: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "feedback3",
          createdByUserName,
          hackathonId: "hackathon3",
          mentorId: "mentor3",
          teamId: "team3",
          feedbackDetails: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockFeedback);
    }, 500);
  });
};

export const fetchMockFeedbackByHackathonId = (
  hackathonId: string
): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockFeedback: Feedback[] = [
        {
          id: "feedback4",
          createdByUserName: "mentorUser1",
          hackathonId,
          mentorId: "mentor4",
          teamId: "team4",
          feedbackDetails: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "feedback5",
          createdByUserName: "mentorUser2",
          hackathonId,
          mentorId: "mentor5",
          teamId: "team5",
          feedbackDetails: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "feedback6",
          createdByUserName: "mentorUser3",
          hackathonId,
          mentorId: "mentor6",
          teamId: "team6",
          feedbackDetails: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockFeedback);
    }, 500);
  });
};
