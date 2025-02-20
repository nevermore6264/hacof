// src\mocks\hackathons.mock.ts

export const hackathonsMock = [
  {
    id: "1",
    name: "Hackathon 2024",
    description: "A great hackathon!",
    date: "2024-04-24",
  },
  {
    id: "2",
    name: "Hackathon 2023",
    description: "Last year's hackathon!",
    date: "2023-04-24",
  },
  {
    id: "3",
    name: "Hackathon 2022",
    description: "Two years ago!",
    date: "2022-04-24",
  },
];

export function getMockHackathonById(id: string) {
  return hackathonsMock.find((h) => h.id === id) || null;
}
