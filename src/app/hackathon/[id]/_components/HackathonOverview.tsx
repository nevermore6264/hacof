// src/app/hackathon/[id]/_components/HackathonOverview.tsx
"use client";
import { useEffect, useState } from "react";
import EnrollmentModal from "./EnrollmentModal";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

type HackathonOverviewProps = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  enrollmentCount: number;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
};

export function getMockMyEnrollment(hackathonId: string) {
  // Mock example response for /api/hackathons/{hackathonId}/my-enrollment
  return {
    hackathonId,
    enrolled: true, // or false
    role: "TeamLeader", // or "TeamMember" or null
    teamId: "team123", // optional
  };
}

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enrollment, setEnrollment] = useState<{
    enrolled: boolean;
    role: string | null;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Simulate API call
      const response = getMockMyEnrollment(id);
      setEnrollment({
        enrolled: response.enrolled,
        role: response.role,
      });
    }
  }, [user, id]);

  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1 text-sm sm:text-base">📅 {date}</p>
      <p className="mt-4 text-gray-700 text-sm sm:text-base">{subtitle}</p>
      <div className="mt-6 flex gap-4">
        {enrollment?.enrolled ? (
          <>
            <button className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full cursor-not-allowed">
              Enrolled as {enrollment.role}
            </button>
            <button
              onClick={() => router.push(`/hackathon/${id}/board`)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition"
            >
              Go to Board
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition"
          >
            Enroll
          </button>
        )}
      </div>
      <p className="mt-2 text-gray-500 text-sm">
        {enrollmentCount === 1
          ? "1 person has registered to participate"
          : `${enrollmentCount} people have registered to participate`}
      </p>

      {isModalOpen && (
        <EnrollmentModal
          hackathonId={id}
          onClose={() => setIsModalOpen(false)}
          minTeam={minimumTeamMembers}
          maxTeam={maximumTeamMembers}
        />
      )}
    </div>
  );
}
