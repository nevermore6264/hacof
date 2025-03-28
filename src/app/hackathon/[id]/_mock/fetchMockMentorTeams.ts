// src/app/hackathon/[id]/_mock/fetchMockMentorTeams.ts
import { MentorTeam } from "@/types/entities/mentorTeam";

export const fetchMockMentorTeams = (
  hackathonId: string,
  teamId: string
): Promise<MentorTeam[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMentorTeams: MentorTeam[] = [
        {
          id: "mentorTeam1",
          mentor: { id: "mentor123", firstName: "John", lastName: "Doe" },
          team: { id: teamId, name: "Team Alpha" },
          hackathon: { id: hackathonId, title: "Hackathon X" },
          mentorshipSessionRequests: [
            {
              id: "session1",
              mentorTeam: undefined,
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 3600000).toISOString(),
              location: "Room A",
              description: "Session on project architecture",
              status: "pending",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "session2",
              mentorTeam: undefined,
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 7200000).toISOString(),
              location: "Room B",
              description: "Code review session",
              status: "approved",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mentorTeam2",
          mentor: { id: "mentor456", firstName: "Jane", lastName: "Smith" },
          team: { id: teamId, name: "Team Beta" },
          hackathon: { id: hackathonId, title: "Hackathon X" },
          mentorshipSessionRequests: [
            {
              id: "session3",
              mentorTeam: undefined,
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 5400000).toISOString(),
              location: "Room C",
              description: "UI/UX design feedback",
              status: "rejected",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockMentorTeams);
    }, 500);
  });
};
