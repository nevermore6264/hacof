// src/app/hackathon/[id]/_components/MentorshipModal.tsx
import { Dialog, Tab } from "@headlessui/react";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import { User } from "@/types/entities/user";
import { fetchMockMentors } from "../_mock/fetchMockMentors";
import { useEffect, useState } from "react";

type MentorshipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mentorTeams: MentorTeam[];
  mentorshipRequests: MentorshipRequest[];
  mentorshipSessionRequests: MentorshipSessionRequest[];
  hackathonId: string;
};

export default function MentorshipModal({
  isOpen,
  onClose,
  mentorTeams,
  mentorshipRequests,
  mentorshipSessionRequests,
  hackathonId,
}: MentorshipModalProps) {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchMockMentors(hackathonId)
        .then((data) => setMentors(data))
        .finally(() => setLoading(false));
    }
  }, [hackathonId, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold">
            Mentorship Overview
          </Dialog.Title>

          <Tab.Group>
            <Tab.List className="flex space-x-2 mt-4 border-b overflow-x-auto whitespace-nowrap scrollbar-hide">
              {[
                "Mentor Teams",
                "Mentorship Requests",
                "Session Requests",
                "Request a Mentor",
              ].map((label, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    `px-4 py-2 text-sm font-medium ${
                      selected
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-600"
                    }`
                  }
                >
                  {label}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="mt-4">
              {/* Mentor Teams */}
              <Tab.Panel>
                {mentorTeams.length > 0 ? (
                  <ul className="space-y-4">
                    {mentorTeams.map((mentorTeam) => (
                      <li
                        key={mentorTeam.id}
                        className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={
                              mentorTeam.mentor.avatarUrl ||
                              "/placeholder-avatar.png"
                            }
                            alt={`${mentorTeam.mentor.firstName} ${mentorTeam.mentor.lastName}`}
                            className="w-12 h-12 rounded-full object-cover bg-gray-200"
                          />
                          <div>
                            <h3 className="font-bold">
                              {mentorTeam.mentor.firstName}{" "}
                              {mentorTeam.mentor.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {mentorTeam.mentor.email}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2">
                          <h4 className="font-semibold text-sm text-gray-700">
                            Session Requests:
                          </h4>
                          {mentorTeam.mentorshipSessionRequests &&
                          mentorTeam.mentorshipSessionRequests.length > 0 ? (
                            <ul className="mt-1 space-y-2">
                              {mentorTeam.mentorshipSessionRequests.map(
                                (session) => (
                                  <li
                                    key={session.id}
                                    className="text-sm p-2 bg-white rounded border"
                                  >
                                    <div className="flex justify-between">
                                      <div className="font-medium">
                                        {session.description}
                                      </div>
                                      <span
                                        className={`px-2 py-0.5 text-xs rounded-full ${
                                          session.status === "approved"
                                            ? "bg-green-100 text-green-700"
                                            : session.status === "rejected"
                                              ? "bg-red-100 text-red-700"
                                              : "bg-yellow-100 text-yellow-700"
                                        }`}
                                      >
                                        {session.status}
                                      </span>
                                    </div>
                                    <div className="mt-1 text-gray-600">
                                      📅{" "}
                                      {new Date(
                                        session.startTime
                                      ).toLocaleString()}{" "}
                                      -{" "}
                                      {new Date(
                                        session.endTime
                                      ).toLocaleString()}
                                    </div>
                                    <div className="text-gray-600">
                                      📍 {session.location}
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500 mt-1">
                              No session requests yet
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex justify-end">
                          <button className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Request Session
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No assigned mentors yet.</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Request a mentor from the "Request a Mentor" tab
                    </p>
                  </div>
                )}
              </Tab.Panel>

              {/* Mentorship Requests */}
              <Tab.Panel>
                {mentorshipRequests.length > 0 ? (
                  <ul className="space-y-4">
                    {mentorshipRequests.map((request) => (
                      <li
                        key={request.id}
                        className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              request.mentor.avatarUrl ||
                              "/placeholder-avatar.png"
                            }
                            alt={`${request.mentor.firstName} ${request.mentor.lastName}`}
                            className="w-12 h-12 rounded-full object-cover bg-gray-200"
                          />
                          <div>
                            <h3 className="font-bold">
                              {request.mentor.firstName}{" "}
                              {request.mentor.lastName}
                            </h3>
                            <div className="flex items-center mt-1">
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  request.status === "APPROVED"
                                    ? "bg-green-100 text-green-700"
                                    : request.status === "REJECTED"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {request.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-sm">
                          <div className="flex flex-wrap gap-1 mt-1">
                            {request.mentor.skills &&
                              request.mentor.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-gray-100 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                          </div>
                        </div>

                        {request.evaluatedBy && (
                          <div className="mt-3 text-xs text-gray-500 border-t pt-2">
                            Evaluated by: {request.evaluatedBy.firstName}{" "}
                            {request.evaluatedBy.lastName}
                            <br />
                            {request.evaluatedAt &&
                              `Date: ${new Date(request.evaluatedAt).toLocaleString()}`}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No pending mentorship requests.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Request a mentor from the "Request a Mentor" tab
                    </p>
                  </div>
                )}
              </Tab.Panel>

              {/* Mentorship Session Requests */}
              <Tab.Panel>
                {mentorshipSessionRequests.length > 0 ? (
                  <ul className="space-y-4">
                    {mentorshipSessionRequests.map((session) => (
                      <li
                        key={session.id}
                        className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">{session.description}</h3>

                            <div className="mt-2 space-y-1 text-sm">
                              <p className="flex items-center gap-2">
                                <span className="text-gray-600">📅</span>
                                <span>
                                  {new Date(
                                    session.startTime
                                  ).toLocaleDateString()}{" "}
                                  at{" "}
                                  {new Date(
                                    session.startTime
                                  ).toLocaleTimeString()}{" "}
                                  -{" "}
                                  {new Date(
                                    session.endTime
                                  ).toLocaleTimeString()}
                                </span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="text-gray-600">📍</span>
                                <span>{session.location}</span>
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              session.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : session.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>

                        {session.evaluatedBy && (
                          <div className="mt-3 text-xs text-gray-500 border-t pt-2">
                            Evaluated by: {session.evaluatedBy.firstName}{" "}
                            {session.evaluatedBy.lastName}
                            <br />
                            {session.evaluatedAt &&
                              `Date: ${new Date(session.evaluatedAt).toLocaleString()}`}
                          </div>
                        )}

                        <div className="mt-3 flex justify-end gap-2">
                          {session.status === "pending" && (
                            <>
                              <button className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                Cancel
                              </button>
                              <button className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Edit
                              </button>
                            </>
                          )}
                          {session.status === "approved" && (
                            <button className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                              Join Session
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No session requests yet.</p>
                  </div>
                )}
              </Tab.Panel>

              {/* Request a Mentor */}
              <Tab.Panel>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mentors.map((mentor) => {
                      const currentTeamCount = mentor.mentorTeams?.length || 0;
                      const maxTeamLimit = mentor.mentorTeamLimits?.length || 5;
                      const full = currentTeamCount >= maxTeamLimit;

                      return (
                        <div
                          key={mentor.id}
                          className={`border rounded-lg p-4 shadow-sm ${
                            full ? "opacity-60" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                mentor.avatarUrl || "/placeholder-avatar.png"
                              }
                              alt={`${mentor.firstName} ${mentor.lastName}`}
                              className="w-12 h-12 rounded-full object-cover bg-gray-200"
                            />
                            <div>
                              <h3 className="font-bold">
                                {mentor.firstName} {mentor.lastName}
                              </h3>
                              {mentor.university && (
                                <p className="text-gray-600 text-sm">
                                  {mentor.university}
                                </p>
                              )}
                            </div>
                          </div>

                          {mentor.bio && (
                            <p className="text-gray-700 mt-3 text-sm line-clamp-3">
                              {mentor.bio}
                            </p>
                          )}

                          {mentor.skills && mentor.skills.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {mentor.skills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 bg-gray-100 rounded text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-sm flex gap-2">
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
                            <div className="text-sm">
                              <span
                                className={
                                  full ? "text-red-500" : "text-green-600"
                                }
                              >
                                {currentTeamCount}/{maxTeamLimit}
                              </span>{" "}
                              teams
                            </div>
                          </div>

                          <button
                            disabled={full}
                            onClick={() => {
                              alert(
                                full
                                  ? "This mentor has reached their team limit."
                                  : `Requested mentorship from ${mentor.firstName}`
                              );
                            }}
                            className={`mt-3 w-full py-2 rounded text-sm font-medium ${
                              full
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                          >
                            {full ? "Mentor at capacity" : "Request Mentorship"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          <div className="mt-6 text-right">
            <button
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
