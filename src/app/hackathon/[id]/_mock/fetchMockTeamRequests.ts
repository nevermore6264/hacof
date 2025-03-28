// src/app/hackathon/[id]/_mock/fetchMockTeamRequests.ts
import { TeamRequest } from "@/types/entities/teamRequest";

export const fetchMockTeamRequests = (
  userId: string,
  hackathonId: string
): Promise<TeamRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeamRequests: TeamRequest[] = [
        {
          id: "request1",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          status: "pending",
          confirmationDeadline: new Date().toISOString(),
          note: "Looking for team members",
          teamRequestMembers: [
            {
              id: "trm1",
              teamRequest: undefined,
              user: { id: userId, firstName: "Your", lastName: "Name" },
              status: "pending",
              respondedAt: "",
            },
            {
              id: "trm2",
              teamRequest: undefined,
              user: { id: "user456", firstName: "Bob", lastName: "Johnson" },
              status: "approved",
              respondedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "request2",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          status: "under_review",
          confirmationDeadline: new Date().toISOString(),
          note: "Need a designer",
          teamRequestMembers: [
            {
              id: "trm3",
              teamRequest: undefined,
              user: { id: userId, firstName: "Your", lastName: "Name" },
              status: "pending",
              respondedAt: "",
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTeamRequests);
    }, 500);
  });
};
