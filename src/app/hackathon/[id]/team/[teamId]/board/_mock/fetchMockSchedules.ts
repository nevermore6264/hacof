// src/app/hackathon/[id]/team/[teamId]/board/_mock/fetchMockSchedules.ts
import { Schedule } from "@/types/entities/schedule";

export const fetchMockSchedules = (
  teamId?: string | null,
  createdByUserName?: string,
  hackathonId?: string
): Promise<Schedule[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockSchedules: Schedule[] = [
        {
          id: "schedule1",
          team: {
            id: "team1",
            name: "Team Alpha",
          },
          hackathon: {
            id: "hackathon1",
            title: "Hackathon X",
          },
          name: "Sprint Planning",
          description: "Planning the upcoming sprint.",
          scheduleEvents: [
            {
              id: "event1",
              name: "Daily Standup",
              description: "Quick status update meeting",
              location: "Zoom",
              startTime: new Date().toISOString(),
              endTime: new Date(new Date().getTime() + 3600000).toISOString(),
              eventLabel: "primary",
              isRecurring: true,
              recurrenceRule: "FREQ=DAILY;INTERVAL=1",
              fileUrls: [],
              attendees: [
                {
                  id: "attendee1",
                  user: {
                    id: "user123",
                    firstName: "Alice",
                    lastName: "Smith",
                    email: "alice.smith@example.com",
                    avatarUrl: "https://example.com/avatars/alice.png",
                  },
                  status: "CONFIRMED",
                },
              ],
              reminders: [
                {
                  id: "reminder1",
                  user: {
                    id: "user123",
                    firstName: "Alice",
                    lastName: "Smith",
                    email: "alice.smith@example.com",
                    avatarUrl: "https://example.com/avatars/alice.png",
                  },
                  remindAt: new Date(
                    new Date().getTime() - 600000
                  ).toISOString(),
                },
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "event2",
              name: "Code Review",
              description: "Reviewing pull requests",
              location: "Google Meet",
              startTime: new Date().toISOString(),
              endTime: new Date(new Date().getTime() + 7200000).toISOString(),
              eventLabel: "warning",
              isRecurring: false,
              recurrenceRule: "",
              fileUrls: [],
              attendees: [],
              reminders: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdByUserName: createdByUserName ?? "your_username",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "schedule2",
          team: teamId
            ? { id: teamId, name: `Mock Team ${teamId}` }
            : undefined,
          hackathon: hackathonId
            ? { id: hackathonId, title: `Hackathon ${hackathonId}` }
            : undefined,
          name: "Retrospective",
          description: "Reviewing past work and improvements.",
          scheduleEvents: [
            {
              id: "event3",
              name: "Feedback Session",
              description: "Discussing project feedback",
              location: "Office",
              startTime: new Date().toISOString(),
              endTime: new Date(new Date().getTime() + 5400000).toISOString(),
              eventLabel: "success",
              isRecurring: false,
              recurrenceRule: "",
              fileUrls: [],
              attendees: [],
              reminders: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdByUserName: createdByUserName ?? "your_username",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      let filteredSchedules: Schedule[];

      if (teamId) {
        filteredSchedules = mockSchedules.filter((s) => s.team?.id === teamId);
      } else {
        filteredSchedules = mockSchedules.filter(
          (s) =>
            s.createdByUserName === createdByUserName &&
            s.hackathon?.id === hackathonId
        );
      }

      resolve(filteredSchedules);
    }, 500);
  });
};
