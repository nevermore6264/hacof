// src/app/hackathon/[id]/_components/HackathonOverview.tsx
"use client";
import { useEffect, useState } from "react";
import EnrollmentModal from "./EnrollmentModal";
import TeamEnrollmentModal from "./TeamEnrollmentModal";
import TeamRequestModal from "./TeamRequestModal";
import IndividualEnrollmentModal from "./IndividualEnrollmentModal";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Team } from "@/types/entities/team";
import { TeamRequest } from "@/types/entities/teamRequest";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";

type HackathonOverviewProps = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  enrollmentCount: number;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
};

const mockUserEnrollment = (userId: string, hackathonId: string) => {
  // Step 1: Mock Teams the user is in that are already enrolled in the hackathon
  const mockTeams: Team[] = [
    {
      id: "team1",
      name: "Team Alpha",
      teamLeader: { id: "user123", firstName: "Alice", lastName: "Smith" },
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
    {
      id: "team2",
      name: "Team Beta",
      teamLeader: { id: "user789", firstName: "Charlie", lastName: "Brown" },
      teamMembers: [
        {
          id: "ut3",
          user: { id: "user789", firstName: "Charlie", lastName: "Brown" },
          team: undefined,
        },
        {
          id: "ut4",
          user: { id: userId, firstName: "Your", lastName: "Name" },
          team: undefined,
        }, // User in Team Beta
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
  ];

  // Step 2: Mock Team Requests the user is in
  const mockTeamRequests: TeamRequest[] = [
    {
      id: "request1",
      hackathon: { id: hackathonId, title: "Hackathon X" },
      status: "pending",
      confirmationDeadline: new Date().toISOString(),
      note: "Looking for team members",
      teamRequestMembers: [
        {
          id: "trm1",
          teamRequest: undefined,
          user: { id: userId, firstName: "Your", lastName: "Name" },
          status: "pending",
          respondedAt: "",
        },
        {
          id: "trm2",
          teamRequest: undefined,
          user: { id: "user456", firstName: "Bob", lastName: "Johnson" },
          status: "approved",
          respondedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "request2",
      hackathon: { id: hackathonId, title: "Hackathon X" },
      status: "under_review",
      confirmationDeadline: new Date().toISOString(),
      note: "Need a designer",
      teamRequestMembers: [
        {
          id: "trm3",
          teamRequest: undefined,
          user: { id: userId, firstName: "Your", lastName: "Name" },
          status: "pending",
          respondedAt: "",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Step 3: Mock Individual Registration Requests by the user
  const mockIndividualRegistrations: IndividualRegistrationRequest[] = [
    {
      id: "reg1",
      hackathon: { id: hackathonId, title: "Hackathon X" },
      status: "PENDING",
      reviewedBy: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "reg2",
      hackathon: { id: hackathonId, title: "Hackathon X" },
      status: "APPROVED",
      reviewedBy: { id: "adminUser", firstName: "Admin", lastName: "User" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  if (["1", "5", "9"].includes(hackathonId) && mockTeams.length > 0) {
    return { type: "Team", data: mockTeams };
  } else if (hackathonId === "2" && mockTeamRequests.length > 0) {
    return { type: "TeamRequest", data: mockTeamRequests };
  } else if (hackathonId === "3" && mockIndividualRegistrations.length > 0) {
    return {
      type: "IndividualRegistrationRequest",
      data: mockIndividualRegistrations,
    };
  } else if (hackathonId === "4") {
    return { type: "none" };
  }

  // Step 4: No enrollment found
  return { type: "none" };
};

const mockMentorTeams = (teamId: string, hackathonId: string): MentorTeam[] => {
  return [
    {
      id: "mentorTeam1",
      hackathon: { id: hackathonId, title: "Hackathon X" },
      mentor: { id: "mentor1", firstName: "John", lastName: "Doe" },
      team: { id: teamId, name: "Team Alpha" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "mentorTeam2",
      hackathon: { id: hackathonId, title: "Hackathon X" },
      mentor: { id: "mentor2", firstName: "Jane", lastName: "Smith" },
      team: { id: teamId, name: "Team Beta" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

const mockMentorshipRequests = (
  teamId: string,
  hackathonId: string
): MentorshipRequest[] => {
  return [
    {
      id: "request1",
      hackathon: { id: hackathonId, title: "Hackathon X" },
      mentor: undefined, // No mentor assigned yet
      team: { id: teamId, name: "Team Alpha" },
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "request2",
      hackathon: { id: hackathonId, title: "Hackathon X" },
      mentor: undefined, // No mentor assigned yet
      team: { id: teamId, name: "Team Beta" },
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

const fetchMentorshipData = (teamId: string, hackathonId: string) => {
  const mentorTeams = mockMentorTeams(teamId, hackathonId);
  if (mentorTeams.length > 0 && hackathonId === "1") {
    return { type: "MentorTeam", data: mentorTeams };
  }

  const mentorshipRequests = mockMentorshipRequests(teamId, hackathonId);
  if (mentorshipRequests.length > 0 && hackathonId === "5") {
    return { type: "MentorshipRequest", data: mentorshipRequests };
  }

  return { type: "none", data: [] };
};

export default function HackathonOverview({
  id,
  title,
  subtitle,
  date,
  enrollmentCount,
  minimumTeamMembers,
  maximumTeamMembers,
}: HackathonOverviewProps) {
  const { user } = useAuthStore(); // Get current user
  const router = useRouter();
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTeamRequestModalOpen, setIsTeamRequestModalOpen] = useState(false);
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);
  const [isMentorshipModalOpen, setIsMentorshipModalOpen] = useState(false);

  const [enrollmentData, setEnrollmentData] = useState<
    | { type: "Team"; data: Team[] }
    | { type: "TeamRequest"; data: TeamRequest[] }
    | {
        type: "IndividualRegistrationRequest";
        data: IndividualRegistrationRequest[];
      }
    | { type: "none" }
  >({ type: "none" });

  const [mentorshipData, setMentorshipData] = useState<
    | { type: "MentorTeam"; data: MentorTeam[] }
    | { type: "MentorshipRequest"; data: MentorshipRequest[] }
    | { type: "none"; data: [] }
  >({ type: "none", data: [] });

  const handleRequestMentorship = () => {
    if (enrollmentData.type === "Team" && enrollmentData.data.length > 0) {
      const teamId = enrollmentData.data[0].id; // Assuming first team
      const data = fetchMentorshipData(teamId, id);
      setMentorshipData(data);
      setIsMentorshipModalOpen(true);
    }
  };

  useEffect(() => {
    if (user?.id) {
      const data = mockUserEnrollment(user.id, id);
      setEnrollmentData(data);
    }
  }, [user, id]);

  const handleOpenModal = () => {
    if (enrollmentData?.type === "Team") {
      setIsTeamModalOpen(true);
    } else if (enrollmentData?.type === "TeamRequest") {
      setIsTeamRequestModalOpen(true);
    } else if (enrollmentData?.type === "IndividualRegistrationRequest") {
      setIsIndividualModalOpen(true);
    } else {
      setIsEnrollmentModalOpen(true);
    }
  };

  const userHasTeam =
    enrollmentData.type === "Team" && enrollmentData.data.length > 0;

  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1 text-sm sm:text-base">📅 {date}</p>
      <p className="mt-4 text-gray-700 text-sm sm:text-base">{subtitle}</p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition"
        >
          {enrollmentData.type === "Team"
            ? "View Team Enrollment"
            : enrollmentData.type === "TeamRequest"
            ? "View Team Request"
            : enrollmentData.type === "IndividualRegistrationRequest"
            ? "View Individual Enrollment"
            : "Enroll"}
        </button>
        <button
          onClick={handleRequestMentorship}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full transition"
        >
          Request Mentorship
        </button>
        {userHasTeam && (
          <button
            onClick={() => router.push(`/hackathon/${id}/board`)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition"
          >
            Go to Board
          </button>
        )}
      </div>
      <p className="mt-2 text-gray-500 text-sm">
        {enrollmentCount === 1
          ? "1 person has registered to participate"
          : `${enrollmentCount} people have registered to participate`}
      </p>

      {isTeamModalOpen && (
        <TeamEnrollmentModal
          teams={enrollmentData.data}
          onClose={() => setIsTeamModalOpen(false)}
        />
      )}
      {isTeamRequestModalOpen && (
        <TeamRequestModal
          requests={enrollmentData.data}
          onClose={() => setIsTeamRequestModalOpen(false)}
        />
      )}
      {isIndividualModalOpen && (
        <IndividualEnrollmentModal
          registrations={enrollmentData.data}
          onClose={() => setIsIndividualModalOpen(false)}
        />
      )}
      {isEnrollmentModalOpen && (
        <EnrollmentModal
          hackathonId={id}
          onClose={() => setIsEnrollmentModalOpen(false)}
          minTeam={minimumTeamMembers}
          maxTeam={maximumTeamMembers}
        />
      )}
      {isMentorshipModalOpen && (
        <MentorshipModal
          mentorshipData={mentorshipData}
          onClose={() => setIsMentorshipModalOpen(false)}
        />
      )}
    </div>
  );
}
