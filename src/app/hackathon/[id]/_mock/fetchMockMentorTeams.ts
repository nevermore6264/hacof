// src/app/hackathon/[id]/_mock/fetchMockMentorTeams.ts
import { MentorTeam } from "@/types/entities/mentorTeam";

export const fetchMockMentorTeams = (
  hackathonId: string
): Promise<MentorTeam[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMentorTeams: MentorTeam[] = [
        {
          id: "mentorTeam1",
          mentor: { id: "mentor123", firstName: "John", lastName: "Doe" },
          team: { id: "team1", name: "Team Alpha" },
          hackathon: { id: hackathonId, title: "Hackathon X" },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mentorTeam2",
          mentor: { id: "mentor456", firstName: "Jane", lastName: "Smith" },
          team: { id: "team2", name: "Team Beta" },
          hackathon: { id: hackathonId, title: "Hackathon X" },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockMentorTeams);
    }, 500);
  });
};
