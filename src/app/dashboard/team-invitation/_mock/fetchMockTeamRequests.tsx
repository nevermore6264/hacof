// src/app/dashboard/team-invitation/_mock/fetchMockTeamRequests.tsx
import { TeamRequest } from "@/types/entities/teamRequest";

export const fetchMockTeamRequests = (
  userId: string
): Promise<TeamRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeamRequests: TeamRequest[] = [
        {
          id: "tr1",
          hackathon: {
            id: "hack1",
            title: "Hackathon Alpha",
          },
          status: "pending",
          confirmationDeadline: new Date().toISOString(),
          note: "Looking for teammates!",
          reviewedBy: undefined,
          teamRequestMembers: [
            {
              id: "trm1",
              user: {
                id: userId,
                firstName: "Your",
                lastName: "Name",
              },
              status: "pending",
              respondedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "trm2",
              user: {
                id: "user456",
                firstName: "Bob",
                lastName: "Johnson",
              },
              status: "no_response",
              respondedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdBy: {
            id: "user123",
            firstName: "Alice",
            lastName: "Smith",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "tr2",
          hackathon: {
            id: "hack2",
            title: "Hackathon Beta",
          },
          status: "under_review",
          confirmationDeadline: new Date().toISOString(),
          note: "Team is reviewing applications.",
          reviewedBy: {
            id: "admin1",
            firstName: "Admin",
            lastName: "User",
          },
          teamRequestMembers: [
            {
              id: "trm3",
              user: {
                id: userId,
                firstName: "Your",
                lastName: "Name",
              },
              status: "approved",
              respondedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdBy: {
            id: "user789",
            firstName: "Charlie",
            lastName: "Brown",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockTeamRequests);
    }, 500);
  });
};
