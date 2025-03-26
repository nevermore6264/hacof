import { Dialog, Tab } from "@headlessui/react";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";

type MentorshipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mentorTeams: MentorTeam[];
  mentorshipRequests: MentorshipRequest[];
  mentorshipSessionRequests: MentorshipSessionRequest[];
};

export default function MentorshipModal({
  isOpen,
  onClose,
  mentorTeams,
  mentorshipRequests,
  mentorshipSessionRequests,
}: MentorshipModalProps) {
  // Determine title based on mentorship status
  const modalTitle = "Mentorship overview";

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Add max height and overflow-y-auto */}
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold">
            {modalTitle}
          </Dialog.Title>

          <Tab.Group>
            <Tab.List className="flex space-x-2 mt-4 border-b">
              <Tab
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium ${
                    selected
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-600"
                  }`
                }
              >
                Mentor Teams
              </Tab>
              <Tab
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium ${
                    selected
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-600"
                  }`
                }
              >
                Mentorship Requests
              </Tab>
              <Tab
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium ${
                    selected
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-600"
                  }`
                }
              >
                Session Requests
              </Tab>
            </Tab.List>

            <Tab.Panels className="mt-4">
              {/* Mentor Teams */}
              <Tab.Panel>
                {mentorTeams.length > 0 ? (
                  <ul className="space-y-2">
                    {mentorTeams.map((mentorTeam) => (
                      <li
                        key={mentorTeam.id}
                        className="p-2 border rounded-md bg-gray-100"
                      >
                        {mentorTeam.team.name} - Mentor:{" "}
                        {mentorTeam.mentor.lastName} +{" "}
                        {mentorTeam.mentor.firstName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No assigned mentors yet.</p>
                )}
              </Tab.Panel>

              {/* Mentorship Requests */}
              <Tab.Panel>
                {mentorshipRequests.length > 0 ? (
                  <ul className="space-y-2">
                    {mentorshipRequests.map((request) => (
                      <li
                        key={request.id}
                        className="p-2 border rounded-md bg-gray-100"
                      >
                        <strong>{request.team.name}</strong> requested
                        mentorship from {request.mentor.firstName}{" "}
                        {request.mentor.lastName}. <br />
                        <span
                          className={`text-sm ${
                            request.status === "APPROVED"
                              ? "text-green-500"
                              : request.status === "REJECTED"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          Status: {request.status}
                        </span>
                        {request.evaluatedBy && (
                          <p className="text-xs text-gray-500">
                            Evaluated by: {request.evaluatedBy.firstName}{" "}
                            {request.evaluatedBy.lastName} at{" "}
                            {new Date(
                              request.evaluatedAt || ""
                            ).toLocaleString()}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    No pending mentorship requests.
                  </p>
                )}
              </Tab.Panel>

              {/* Mentorship Session Requests */}
              <Tab.Panel>
                {mentorshipSessionRequests.length > 0 ? (
                  <ul className="space-y-2">
                    {mentorshipSessionRequests.map((session) => (
                      <li
                        key={session.id}
                        className="p-2 border rounded-md bg-gray-100"
                      >
                        <strong>
                          Session with {session.mentorTeam.mentor?.firstName}{" "}
                          {session.mentorTeam.mentor?.lastName}
                        </strong>{" "}
                        <br />
                        📅 {new Date(session.startTime).toLocaleString()} -{" "}
                        {new Date(session.endTime).toLocaleString()} <br />
                        📍 {session.location} <br />
                        📝 {session.description} <br />
                        <span
                          className={`text-sm ${
                            session.status === "approved"
                              ? "text-green-500"
                              : session.status === "rejected"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          Status: {session.status}
                        </span>
                        {session.evaluatedBy && (
                          <p className="text-xs text-gray-500">
                            Evaluated by: {session.evaluatedBy.firstName}{" "}
                            {session.evaluatedBy.lastName} at{" "}
                            {new Date(
                              session.evaluatedAt || ""
                            ).toLocaleString()}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No session requests yet.</p>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          <div className="mt-6 text-right">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
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
