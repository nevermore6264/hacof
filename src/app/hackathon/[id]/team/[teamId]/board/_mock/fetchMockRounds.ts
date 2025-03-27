// src/app/hackathon/[id]/team/[teamId]/board/_mock/fetchMockRounds.ts
import { Round, RoundStatus } from "@/types/entities/round";

export const fetchMockRounds = (hackathonId: string): Promise<Round[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockRounds: Round[] = [
        {
          id: "round1",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours later
          roundNumber: 1,
          roundTitle: "Idea Submission",
          status: RoundStatus.UPCOMING,
          submissions: [],
          roundMarkCriteria: [],
          judgeRounds: [],
          teamRounds: [],
          roundLocations: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "round2",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          startTime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(), // 3 hours later
          endTime: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(), // 6 hours later
          roundNumber: 2,
          roundTitle: "Prototype Development",
          status: RoundStatus.UPCOMING,
          submissions: [],
          roundMarkCriteria: [],
          judgeRounds: [],
          teamRounds: [],
          roundLocations: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockRounds);
    }, 500);
  });
};
