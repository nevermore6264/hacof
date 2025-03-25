// src/app/hackathon/[id]/_components/TeamEnrollmentModal.tsx
import React from "react";
import { Team } from "@/types/entities/team";

type TeamEnrollmentModalProps = {
  teams: Team[];
  onClose: () => void;
};

export default function TeamEnrollmentModal({
  teams,
  onClose,
}: TeamEnrollmentModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Team Enrollment</h2>
        {teams.length > 0 ? (
          <ul className="space-y-2">
            {teams.map((team) => (
              <li key={team.id} className="p-2 border rounded">
                <p className="font-medium">{team.name}</p>
                <p className="text-sm text-gray-600">
                  Leader: {team.teamLeader.firstName} {team.teamLeader.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  Members: {team.teamMembers.length}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No enrolled teams found.</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
