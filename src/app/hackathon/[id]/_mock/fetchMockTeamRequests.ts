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
          status: "pending",
          confirmationDeadline: new Date().toISOString(),
          note: "Looking for team members",
          teamRequestMembers: [
            {
              id: "trm1",
              teamRequest: undefined,
              user: {
                id: userId,
                firstName: "Your",
                lastName: "Name",
                email: "yourname@example.com",
                username: "yourname",
                avatarUrl: "https://example.com/your-avatar.png",
                status: "Active",
                userRoles: [
                  {
                    id: "ur1",
                    user: { id: userId },
                    role: { id: "2", name: "PARTICIPANT" },
                  },
                ],
              },
              status: "pending",
              respondedAt: "",
            },
            {
              id: "trm2",
              teamRequest: undefined,
              user: {
                id: "user456",
                firstName: "Bob",
                lastName: "Johnson",
                email: "bob.johnson@example.com",
                username: "bobjohnson",
                avatarUrl: "https://example.com/bob-avatar.png",
                status: "Active",
                userRoles: [
                  {
                    id: "ur2",
                    user: { id: "user456" },
                    role: { id: "2", name: "PARTICIPANT" },
                  },
                ],
              },
              status: "approved",
              respondedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "request2",
          status: "under_review",
          confirmationDeadline: new Date().toISOString(),
          note: "Need a designer",
          teamRequestMembers: [
            {
              id: "trm3",
              teamRequest: undefined,
              user: {
                id: userId,
                firstName: "Your",
                lastName: "Name",
                email: "yourname@example.com",
                username: "yourname",
                avatarUrl: "https://example.com/your-avatar.png",
                status: "Active",
                userRoles: [
                  {
                    id: "ur3",
                    user: { id: userId },
                    role: { id: "2", name: "PARTICIPANT" },
                  },
                ],
              },
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
