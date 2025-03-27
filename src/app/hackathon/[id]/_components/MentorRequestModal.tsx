"use client";
import { useEffect, useState } from "react";
import { fetchMockMentors } from "../_mock/fetchMockMentors";
import { User } from "@/types/entities/user";

type MentorRequestModalProps = {
  hackathonId: string;
  onClose: () => void;
};

export default function MentorRequestModal({
  hackathonId,
  onClose,
}: MentorRequestModalProps) {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockMentors(hackathonId)
      .then((data) => {
        setMentors(data);
      })
      .finally(() => setLoading(false));
  }, [hackathonId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full overflow-y-auto max-h-[80vh] relative">
        <h2 className="text-2xl font-bold mb-4">Request Mentorship</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        {loading ? (
          <p className="text-center text-gray-500">Loading mentors...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mentors.map((mentor) => {
              const currentTeamCount = mentor.mentorTeams.length;
              const maxTeamLimit = mentor.mentorTeamLimits.length || 5; // Default to 3 if missing
              const full = currentTeamCount >= maxTeamLimit;

              return (
                <div
                  key={mentor.id}
                  className={`border rounded-lg p-4 shadow ${
                    full ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={mentor.avatarUrl}
                      alt={`${mentor.firstName} ${mentor.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-lg">
                        {mentor.firstName} {mentor.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {mentor.university}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-3 text-sm">{mentor.bio}</p>
                  <div className="mt-2 text-xs text-gray-500 flex gap-2">
                    {mentor.linkedinUrl && (
                      <a
                        href={mentor.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                    {mentor.githubUrl && (
                      <a
                        href={mentor.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                  <p className="mt-3 text-sm">
                    {currentTeamCount} / {maxTeamLimit} teams
                  </p>
                  <button
                    disabled={full}
                    onClick={() => {
                      alert(
                        full
                          ? "This mentor has reached their team limit."
                          : `Requested mentorship from ${mentor.firstName}`
                      );
                    }}
                    className={`mt-3 w-full py-2 rounded ${
                      full
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {full ? "Full" : "Request Mentorship"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
