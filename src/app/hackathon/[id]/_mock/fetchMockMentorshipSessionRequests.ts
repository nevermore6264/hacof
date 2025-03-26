import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";

export const fetchMockMentorshipSessionRequests = (
  mentorTeamId: string
): Promise<MentorshipSessionRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMentorshipSessionRequests: MentorshipSessionRequest[] = [
        {
          id: "session1",
          mentorTeam: { id: mentorTeamId },
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
          mentorTeam: { id: mentorTeamId },
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 7200000).toISOString(),
          location: "Room B",
          description: "Code review session",
          status: "approved",
          evaluatedBy: {
            id: "admin789",
            firstName: "Alice",
            lastName: "Johnson",
          },
          evaluatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "session3",
          mentorTeam: { id: mentorTeamId },
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 5400000).toISOString(),
          location: "Room C",
          description: "UI/UX design feedback",
          status: "rejected",
          evaluatedBy: {
            id: "admin101",
            firstName: "Chris",
            lastName: "Evans",
          },
          evaluatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockMentorshipSessionRequests);
    }, 500);
  });
};
