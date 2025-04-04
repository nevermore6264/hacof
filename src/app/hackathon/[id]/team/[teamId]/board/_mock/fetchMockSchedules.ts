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
          team: teamId
            ? {
                id: teamId,
                name: `Mock Team ${teamId}`,
                teamLeader: {
                  id: "leader1",
                  firstName: "John",
                  lastName: "Doe",
                  email: "john.doe@example.com",
                  avatarUrl: "https://example.com/avatars/john.png",
                  experienceLevel: "Advanced",
                },
                teamMembers: [
                  {
                    id: "member1",
                    user: {
                      id: "user123",
                      firstName: "Alice",
                      lastName: "Smith",
                      email: "alice.smith@example.com",
                      avatarUrl: "https://example.com/avatars/alice.png",
                      skills: ["JavaScript", "React"],
                      experienceLevel: "Intermediate",
                    },
                  },
                  {
                    id: "member2",
                    user: {
                      id: "user456",
                      firstName: "Bob",
                      lastName: "Johnson",
                      email: "bob.johnson@example.com",
                      avatarUrl: "https://example.com/avatars/bob.png",
                      skills: ["Python", "Django"],
                      experienceLevel: "Advanced",
                    },
                  },
                ],
                bio: "A passionate development team.",
                isDeleted: false,
              }
            : undefined,
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
                    bio: "Passionate software engineer",
                    country: "USA",
                    city: "San Francisco",
                    birthdate: "1990-05-15",
                    phone: "+123456789",
                    studentId: "S12345",
                    university: "FPT University",
                    linkedinUrl: "https://linkedin.com/in/alicesmith",
                    githubUrl: "https://github.com/alicesmith",
                    skills: ["JavaScript", "React", "Node.js"],
                    experienceLevel: "Advanced",
                    status: "Active",
                    userRoles: [],
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
                    bio: "Passionate software engineer",
                    country: "USA",
                    city: "San Francisco",
                    birthdate: "1990-05-15",
                    phone: "+123456789",
                    studentId: "S12345",
                    university: "FPT University",
                    linkedinUrl: "https://linkedin.com/in/alicesmith",
                    githubUrl: "https://github.com/alicesmith",
                    skills: ["JavaScript", "React", "Node.js"],
                    experienceLevel: "Advanced",
                    status: "Active",
                    userRoles: [],
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
