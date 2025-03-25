// src/app/hackathon/[id]/_mock/fetchMockMentorshipSessionRequests.ts
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";

export const fetchMockMentorshipSessionRequests = (
  hackathonId: string
): Promise<MentorshipSessionRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockRequests: MentorshipSessionRequest[] = [
        {
          id: "session1",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          mentor: { id: "mentor123", firstName: "John", lastName: "Doe" },
          team: { id: "team1", name: "Team Alpha" },
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          location: "Room 101",
          description: "Discuss project scope",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "session2",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          mentor: { id: "mentor456", firstName: "Jane", lastName: "Smith" },
          team: { id: "team2", name: "Team Beta" },
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
          location: "Room 102",
          description: "Code review and debugging",
          status: "approved",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockRequests);
    }, 500);
  });
};
