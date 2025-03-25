// src/app/hackathon/[id]/_components/EnrollmentModal.tsx
"use client";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { TeamRequest } from "@/types/entities/teamRequest";
import { Team } from "@/types/entities/team";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import EnrollmentFormTab from "./EnrollmentFormTab";

type EnrollmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  individualRegistrations: IndividualRegistrationRequest[];
  teamRequests: TeamRequest[];
  teams: Team[];
  hackathonId: string;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
};

export default function EnrollmentModal({
  isOpen,
  onClose,
  individualRegistrations,
  teamRequests,
  teams,
  hackathonId,
  minimumTeamMembers,
  maximumTeamMembers,
}: EnrollmentModalProps) {
  const [activeTab, setActiveTab] = useState<
    "teams" | "teamRequests" | "individual" | "enroll"
  >("teams");

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Modal background and transition */}
        <div className="fixed inset-0 bg-black bg-opacity-25" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-xl font-bold mb-4">
                Enrollment Overview
              </Dialog.Title>

              <div className="flex gap-2 mb-4 border-b pb-2">
                <button
                  onClick={() => setActiveTab("teams")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "teams"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  My Teams
                </button>
                <button
                  onClick={() => setActiveTab("teamRequests")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "teamRequests"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Team Requests
                </button>
                <button
                  onClick={() => setActiveTab("individual")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "individual"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Individual Registrations
                </button>
                <button
                  onClick={() => setActiveTab("enroll")}
                  className={`px-4 py-2 rounded ${
                    activeTab === "enroll"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Enroll
                </button>
              </div>

              {activeTab === "teams" && (
                <div>
                  {teams.length === 0 ? (
                    <p>No teams found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {teams.map((team) => (
                        <li key={team.id} className="border p-3 rounded">
                          <p className="font-semibold">{team.name}</p>
                          <p className="text-sm text-gray-500">
                            Members:{" "}
                            {team.teamMembers
                              .map((m) => m.user.firstName)
                              .join(", ")}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === "teamRequests" && (
                <div>
                  {teamRequests.length === 0 ? (
                    <p>No team requests found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {teamRequests.map((request) => (
                        <li key={request.id} className="border p-3 rounded">
                          <p className="font-semibold">
                            Request: {request.note}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {request.status}
                          </p>
                          <p className="text-sm text-gray-500">
                            Members:{" "}
                            {request.teamRequestMembers
                              .map((m) => m.user.firstName)
                              .join(", ")}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === "individual" && (
                <div>
                  {individualRegistrations.length === 0 ? (
                    <p>No individual enrollments found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {individualRegistrations.map((reg) => (
                        <li key={reg.id} className="border p-3 rounded">
                          <p className="font-semibold">Status: {reg.status}</p>
                          <p className="text-sm text-gray-500">
                            Registered at: {reg.createdAt}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {activeTab === "enroll" && (
                <EnrollmentFormTab
                  hackathonId={hackathonId}
                  minTeam={minimumTeamMembers}
                  maxTeam={maximumTeamMembers}
                />
              )}
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
