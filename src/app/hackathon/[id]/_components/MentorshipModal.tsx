// src/app/hackathon/[id]/_components/MentorshipModal.tsx
import { Dialog, Tab } from "@headlessui/react";
import { MentorTeam } from "@/types/entities/mentorTeam";
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";
import { MentorshipSessionRequest } from "@/types/entities/mentorshipSessionRequest";
import { User } from "@/types/entities/user";
import { useEffect, useState } from "react";
import { fetchMockMentors } from "../_mock/fetchMockMentors";
import MentorTeamsTab from "./MentorTeamsTab";
import MentorshipRequestsTab from "./MentorshipRequestsTab";
import SessionRequestsTab from "./SessionRequestsTab";
import RequestMentorTab from "./RequestMentorTab";
import {
  createMentorshipRequest,
  deleteMentorshipRequest,
} from "../_api/mentorshipRequestAPI";
import {
  createSessionRequest,
  updateSessionRequest,
} from "../_api/sessionRequestAPI";

type MentorshipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mentorTeams: MentorTeam[];
  mentorshipRequests: MentorshipRequest[];
  mentorshipSessionRequests: MentorshipSessionRequest[];
  hackathonId: string;
  teamId: string; // Added teamId for creating requests
  onDataUpdate: () => void; // Callback to refresh parent data
};

export default function MentorshipModal({
  isOpen,
  onClose,
  mentorTeams,
  mentorshipRequests,
  mentorshipSessionRequests,
  hackathonId,
  teamId,
  onDataUpdate,
}: MentorshipModalProps) {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchMockMentors(hackathonId)
        .then((data) => setMentors(data))
        .finally(() => setLoading(false));
    }
  }, [hackathonId, isOpen]);

  // Handler for creating a new mentorship request
  const handleCreateMentorshipRequest = async (mentorId: string) => {
    try {
      await createMentorshipRequest({
        hackathonId,
        mentorId,
        teamId,
        status: "PENDING",
      });
      onDataUpdate(); // Refresh data after successful creation
    } catch (error) {
      console.error("Failed to create mentorship request:", error);
    }
  };

  // Handler for deleting a mentorship request
  const handleDeleteMentorshipRequest = async (requestId: string) => {
    try {
      await deleteMentorshipRequest(requestId);
      onDataUpdate(); // Refresh data after successful deletion
    } catch (error) {
      console.error("Failed to delete mentorship request:", error);
    }
  };

  // Handler for creating a new session request
  const handleCreateSessionRequest = async (data: {
    mentorTeamId: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
  }) => {
    try {
      await createSessionRequest({
        ...data,
        status: "pending",
      });
      onDataUpdate(); // Refresh data after successful creation
    } catch (error) {
      console.error("Failed to create session request:", error);
    }
  };

  // Handler for updating a session request
  const handleUpdateSessionRequest = async (
    sessionId: string,
    data: {
      startTime?: string;
      endTime?: string;
      location?: string;
      description?: string;
      status?: "pending" | "deleted";
    }
  ) => {
    try {
      await updateSessionRequest(sessionId, data);
      onDataUpdate(); // Refresh data after successful update
    } catch (error) {
      console.error("Failed to update session request:", error);
    }
  };

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
                <MentorTeamsTab
                  mentorTeams={mentorTeams}
                  onCreateSessionRequest={handleCreateSessionRequest}
                />
              </Tab.Panel>

              {/* Mentorship Requests */}
              <Tab.Panel>
                <MentorshipRequestsTab
                  mentorshipRequests={mentorshipRequests}
                  onDeleteRequest={handleDeleteMentorshipRequest}
                />
              </Tab.Panel>

              {/* Mentorship Session Requests */}
              <Tab.Panel>
                <SessionRequestsTab
                  sessionRequests={mentorshipSessionRequests}
                  onUpdateRequest={handleUpdateSessionRequest}
                />
              </Tab.Panel>

              {/* Request a Mentor */}
              <Tab.Panel>
                <RequestMentorTab
                  mentors={mentors}
                  loading={loading}
                  onRequestMentorship={handleCreateMentorshipRequest}
                />
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
