// src/app/hackathon/[id]/_components/HackathonOverview.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { fetchMockIndividualRegistrations } from "../_mock/fetchMockIndividualRegistrations";
import { fetchMockTeamRequests } from "../_mock/fetchMockTeamRequests";
import { fetchMockTeams } from "../_mock/fetchMockTeams";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { TeamRequest } from "@/types/entities/teamRequest";
import { Team } from "@/types/entities/team";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import EnrollmentModal from "./EnrollmentModal";
import MentorshipModal from "./MentorshipModal";

type HackathonOverviewProps = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  enrollmentCount: number;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
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

  const [individualRegistrations, setIndividualRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [mentorTeams, setMentorTeams] = useState<MentorTeam[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<
    MentorshipSessionRequest[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMentorshipModalOpen, setIsMentorshipModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fetch all data
    const fetchData = async () => {
      const [indivRegs, teamReqs, userTeams] = await Promise.all([
        fetchMockIndividualRegistrations(user.id, id),
        fetchMockTeamRequests(user.id, id),
        fetchMockTeams(user.id, id),
      ]);

      setIndividualRegistrations(indivRegs);
      setTeamRequests(teamReqs);
      setTeams(userTeams);

      if (userTeams.length > 0) {
        const teamId = userTeams[0].id;
        const [mentorTeamData, mentorshipRequestData] = await Promise.all([
          fetchMockMentorTeams(id),
          fetchMockMentorshipSessionRequests(id),
        ]);

        setMentorTeams(mentorTeamData.filter((mt) => mt.team.id === teamId));
        setMentorshipRequests(
          mentorshipRequestData.filter((mr) => mr.team.id === teamId)
        );
      }
    };
    fetchData();
  }, [user, id]);

  // Determine button title
  let buttonTitle = "Enroll";
  if (teams.length > 0) {
    buttonTitle = "View Team Enrollment";
  } else if (teamRequests.length > 0) {
    buttonTitle = "View Team Request";
  } else if (individualRegistrations.length > 0) {
    buttonTitle = "View Individual Enrollment";
  }

  const handleGoToBoard = () => {
    if (teams.length > 0) {
      // Assuming the board URL pattern (adjust if needed)
      router.push(`/hackathon/${id}/team/${teams[0].id}/board`);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">📅 {date}</p>
        <p className="mt-4 text-gray-700 text-sm sm:text-base">{subtitle}</p>
        <div className="mt-6 flex gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition"
            onClick={() => setIsModalOpen(true)}
          >
            {buttonTitle}
          </button>
          {teams.length > 0 && (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition"
                onClick={handleGoToBoard}
              >
                Go to board
              </button>
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full transition"
                onClick={() => setIsMentorshipModalOpen(true)}
              >
                Request Mentorship
              </button>
            </>
          )}
        </div>
        <p className="mt-2 text-gray-500 text-sm">
          {enrollmentCount === 1
            ? "1 person has registered to participate"
            : `${enrollmentCount} people have registered to participate`}
        </p>
      </div>
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        individualRegistrations={individualRegistrations}
        teamRequests={teamRequests}
        teams={teams}
        hackathonId={id}
        minimumTeamMembers={minimumTeamMembers}
        maximumTeamMembers={maximumTeamMembers}
      />
      {/* Mentorship Modal */}
      <MentorshipModal
        isOpen={isMentorshipModalOpen}
        onClose={() => setIsMentorshipModalOpen(false)}
        mentorTeams={mentorTeams}
        mentorshipRequests={mentorshipRequests}
        hackathonId={id}
        teamId={teams.length > 0 ? teams[0].id : ""}
      />
    </>
  );
}
