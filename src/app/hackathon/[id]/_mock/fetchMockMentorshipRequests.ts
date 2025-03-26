import {
  MentorshipRequest,
  MentorshipStatus,
} from "@/types/entities/mentorshipRequest";

export const fetchMockMentorshipRequests = (
  teamId: string,
  hackathonId: string
): Promise<MentorshipRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMentorshipRequests: MentorshipRequest[] = [
        {
          id: "mentorshipReq1",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          mentor: { id: "mentor123", firstName: "John", lastName: "Doe" },
          team: { id: teamId, name: "Team Alpha" },
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mentorshipReq2",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          mentor: { id: "mentor456", firstName: "Jane", lastName: "Smith" },
          team: { id: teamId, name: "Team Alpha" },
          status: "APPROVED",
          evaluatedAt: new Date().toISOString(),
          evaluatedBy: {
            id: "admin789",
            firstName: "Alice",
            lastName: "Johnson",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mentorshipReq3",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          mentor: { id: "mentor789", firstName: "Michael", lastName: "Brown" },
          team: { id: teamId, name: "Team Alpha" },
          status: "REJECTED",
          evaluatedAt: new Date().toISOString(),
          evaluatedBy: {
            id: "admin101",
            firstName: "Chris",
            lastName: "Evans",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockMentorshipRequests);
    }, 500);
  });
};
