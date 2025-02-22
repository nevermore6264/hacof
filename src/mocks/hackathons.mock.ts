// src/mocks/hackathons.mock.ts

import { Hackathon } from "@/types/entities/hackathon";

export const hackathonsMock: Hackathon[] = [
  {
    id: "1",
    title: "Hackathon 2024",
    subtitle: "Innovate, Build, Compete!",
    bannerImageUrl:
      "https://doanthanhnien.vn/Content/uploads/images/132311755918511627_Banner.jpg",
    enrollStartDate: "2024-03-01",
    enrollEndDate: "2024-04-01",
    enrollmentCount: 150,
    startDate: "2024-04-05",
    endDate: "2024-04-07",
    information:
      "Join us for an exciting 48-hour hackathon where innovation meets execution. Join us for an exciting 48-hour hackathon where innovation meets execution. Join us for an exciting 48-hour hackathon where innovation meets execution.",
    description:
      "A great hackathon that brings together developers, designers, and entrepreneurs.",
    participant: "Open to students and professionals from all backgrounds.",
    documentation: [
      "https://example.com/docs/hackathon-2024-rules.pdf",
      "https://example.com/docs/hackathon-2024-schedule.pdf",
    ],
    contact: "contact@hackathon2024.com",
    category: "Coding Hackathons",
    organization: "FPTU",
    enrollmentStatus: "open",
  },
  {
    id: "2",
    title: "Hackathon 2023",
    subtitle: "Code, Create, Collaborate!",
    bannerImageUrl:
      "https://i0.wp.com/hannahed.co/wp-content/uploads/2022/07/290782336_7746065928768366_6033188322521996662_n.jpg?w=1080&ssl=1",
    enrollStartDate: "2023-03-10",
    enrollEndDate: "2023-04-10",
    enrollmentCount: 120,
    startDate: "2023-04-15",
    endDate: "2023-04-17",
    information:
      "A thrilling hackathon experience filled with creativity and problem-solving.",
    description: "Last year's hackathon where teams built amazing projects.",
    participant: "Anyone passionate about technology and innovation.",
    documentation: [
      "https://example.com/docs/hackathon-2023-rules.pdf",
      "https://example.com/docs/hackathon-2023-schedule.pdf",
    ],
    contact: "contact@hackathon2023.com",
    category: "Design Hackathons",
    organization: "NASA",
    enrollmentStatus: "closed",
  },
  {
    id: "3",
    title: "Hackathon 2022",
    subtitle: "Think Big, Build Bigger!",
    bannerImageUrl:
      "https://moitruongachau.com/vnt_upload/career/06_2022/Vong_chung_ket_cuoc_thi_hoc_thuat_Loc_Xanh.png",
    enrollStartDate: "2022-03-15",
    enrollEndDate: "2022-04-15",
    enrollmentCount: 100,
    startDate: "2022-04-20",
    endDate: "2022-04-22",
    information:
      "A hackathon where ideas turned into reality through technology.",
    description:
      "Two years ago, developers gathered to solve real-world challenges.",
    participant: "Students, developers, and startup enthusiasts.",
    documentation: [
      "https://example.com/docs/hackathon-2022-rules.pdf",
      "https://example.com/docs/hackathon-2022-schedule.pdf",
    ],
    contact: "contact@hackathon2022.com",
    category: "External Hackathons",
    organization: "IAI HACKATHON",
    enrollmentStatus: "open",
  },
];

export function getMockHackathonById(id: string): Hackathon | null {
  return hackathonsMock.find((h) => h.id === id) || null;
}
