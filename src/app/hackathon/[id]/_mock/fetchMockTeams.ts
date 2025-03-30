// src/app/hackathon/[id]/_mock/fetchMockTeams.ts
import { Team } from "@/types/entities/team";

export const fetchMockTeams = (
  userId: string,
  hackathonId: string
): Promise<Team[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeams: Team[] = [
        {
          id: "team1",
          name: "Team Alpha",
          teamLeader: { id: "user123", firstName: "Alice", lastName: "Smith" },
          teamMembers: [
            {
              id: "ut1",
              user: { id: "user123", firstName: "Alice", lastName: "Smith" },
              team: undefined,
            },
            {
              id: "ut2",
              user: { id: "user456", firstName: "Bob", lastName: "Johnson" },
              team: undefined,
            },
          ],
          teamHackathons: [
            {
              id: "th1",
              team: undefined,
              hackathon: { id: hackathonId, title: "Hackathon X" },
              status: "Active",
            },
          ],
          isDeleted: false,
          bio: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "team2",
          name: "Team Beta",
          teamLeader: {
            id: "user789",
            firstName: "Charlie",
            lastName: "Brown",
          },
          teamMembers: [
            {
              id: "ut3",
              user: { id: "user789", firstName: "Charlie", lastName: "Brown" },
              team: undefined,
            },
            {
              id: "ut4",
              user: { id: userId, firstName: "Your", lastName: "Name" },
              team: undefined,
            }, // User in Team Beta
          ],
          teamHackathons: [
            {
              id: "th3",
              team: undefined,
              hackathon: { id: hackathonId, title: "Hackathon X" },
              status: "Active",
            },
          ],
          isDeleted: false,
          bio: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTeams);
    }, 500);
  });
};
