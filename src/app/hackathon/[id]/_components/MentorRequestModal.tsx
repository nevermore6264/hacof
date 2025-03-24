"use client";
import { useEffect, useState } from "react";

type Mentor = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  bio: string;
  linkedinUrl: string;
  githubUrl: string;
  university: string;
  currentTeamCount: number;
  maxTeamLimit: number;
};

type MentorRequestModalProps = {
  hackathonId: string;
  onClose: () => void;
};

export default function MentorRequestModal({
  hackathonId,
  onClose,
}: MentorRequestModalProps) {
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    // Simulate fetching mock data:
    const mockMentors: Mentor[] = [
      {
        id: "1",
        firstName: "Alice",
        lastName: "Johnson",
        avatarUrl: "https://randomuser.me/api/portraits/women/1.jpg",
        bio: "Software engineer passionate about helping hackathon teams.",
        linkedinUrl: "https://linkedin.com/in/alicejohnson",
        githubUrl: "https://github.com/alicejohnson",
        university: "MIT",
        currentTeamCount: 2,
        maxTeamLimit: 3,
      },
      {
        id: "2",
        firstName: "Bob",
        lastName: "Smith",
        avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg",
        bio: "Full-stack developer and mentor for web projects.",
        linkedinUrl: "https://linkedin.com/in/bobsmith",
        githubUrl: "https://github.com/bobsmith",
        university: "Stanford",
        currentTeamCount: 3,
        maxTeamLimit: 3,
      },
      {
        id: "3",
        firstName: "Clara",
        lastName: "Lee",
        avatarUrl: "https://randomuser.me/api/portraits/women/3.jpg",
        bio: "ML researcher and startup advisor.",
        linkedinUrl: "https://linkedin.com/in/claralee",
        githubUrl: "https://github.com/claralee",
        university: "Harvard",
        currentTeamCount: 1,
        maxTeamLimit: 3,
      },
    ];

    setTimeout(() => {
      setMentors(mockMentors);
    }, 500); // Simulate slight loading delay
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mentors.map((mentor) => {
            const full = mentor.currentTeamCount >= mentor.maxTeamLimit;
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
                    <p className="text-gray-600 text-sm">{mentor.university}</p>
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
                  {mentor.currentTeamCount} / {mentor.maxTeamLimit} teams
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
      </div>
    </div>
  );
}
