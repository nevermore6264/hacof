// src/app/hackathon/[id]/team/[teamId]/board/_mock/fetchMockHackathonResults.ts
import { HackathonResult } from "@/types/entities/hackathonResult";

export const fetchMockHackathonResults = (
  hackathonId: string
): Promise<HackathonResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResults: HackathonResult[] = [
        {
          id: "result1",
          hackathon: {
            id: hackathonId,
            title: "Hackathon X",
          },
          team: {
            id: "team1",
            name: "Team Alpha",
            teamLeader: {
              id: "user123",
              firstName: "Alice",
              lastName: "Smith",
            },
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
            mentorTeams: [],
            mentorTeamLimits: [],
            mentorshipRequests: [],
            mentorshipSessionRequests: [],
            teamRounds: [],
            hackathonResults: [],
            feedbacks: [],
            bio: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          totalScore: 95,
          placement: 1,
          award: "First Place",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "result2",
          hackathon: {
            id: hackathonId,
            title: "Hackathon X",
          },
          team: {
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
                user: {
                  id: "user789",
                  firstName: "Charlie",
                  lastName: "Brown",
                },
                team: undefined,
              },
              {
                id: "ut4",
                user: { id: "user567", firstName: "Eve", lastName: "Adams" },
                team: undefined,
              },
            ],
            teamHackathons: [
              {
                id: "th2",
                team: undefined,
                hackathon: { id: hackathonId, title: "Hackathon X" },
                status: "Active",
              },
            ],
            isDeleted: false,
            mentorTeams: [],
            mentorTeamLimits: [],
            mentorshipRequests: [],
            mentorshipSessionRequests: [],
            teamRounds: [],
            hackathonResults: [],
            feedbacks: [],
            bio: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          totalScore: 85,
          placement: 2,
          award: "Second Place",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "result3",
          hackathon: {
            id: hackathonId,
            title: "Hackathon X",
          },
          team: {
            id: "team3",
            name: "Team Gamma",
            teamLeader: {
              id: "user999",
              firstName: "Dave",
              lastName: "Miller",
            },
            teamMembers: [
              {
                id: "ut5",
                user: { id: "user999", firstName: "Dave", lastName: "Miller" },
                team: undefined,
              },
              {
                id: "ut6",
                user: {
                  id: "user777",
                  firstName: "Olivia",
                  lastName: "Taylor",
                },
                team: undefined,
              },
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
            mentorTeams: [],
            mentorTeamLimits: [],
            mentorshipRequests: [],
            mentorshipSessionRequests: [],
            teamRounds: [],
            hackathonResults: [],
            feedbacks: [],
            bio: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          totalScore: 78,
          placement: 3,
          award: "Third Place",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockResults);
    }, 500);
  });
};
