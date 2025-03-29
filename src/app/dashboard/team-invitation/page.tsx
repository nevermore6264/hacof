// src/app/dashboard/team-invitation/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchMockTeamRequests } from "./_mock/fetchMockTeamRequests";
import { useAuth } from "@/hooks/useAuth_v0";
import { TeamRequest } from "@/types/entities/teamRequest";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function TeamInvitationPage() {
  const { user } = useAuth();
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [expandedHackathons, setExpandedHackathons] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (user) {
      fetchMockTeamRequests(user.id).then(setTeamRequests);
    }
  }, [user]);

  const toggleExpand = (hackathonId: string) => {
    setExpandedHackathons((prev) => ({
      ...prev,
      [hackathonId]: !prev[hackathonId],
    }));
  };

  // Group team requests by hackathon
  const groupedRequests = teamRequests.reduce(
    (acc, request) => {
      if (!request.hackathon) return acc;
      const hackathonId = request.hackathon.id;
      if (!acc[hackathonId]) {
        acc[hackathonId] = { title: request.hackathon.title, requests: [] };
      }
      acc[hackathonId].requests.push(request);
      return acc;
    },
    {} as Record<string, { title: string; requests: TeamRequest[] }>
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <div className="mt-6 w-full max-w-3xl">
        {Object.entries(groupedRequests).map(
          ([hackathonId, { title, requests }]) => (
            <div
              key={hackathonId}
              className="mb-4 bg-white rounded-lg shadow p-4"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(hackathonId)}
              >
                <h2 className="text-xl font-semibold">{title}</h2>
                {expandedHackathons[hackathonId] ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>

              {expandedHackathons[hackathonId] && (
                <div className="mt-3 space-y-3">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-3 bg-gray-50"
                    >
                      <p className="text-gray-800">
                        <strong>Note:</strong> {request.note}
                      </p>
                      <p className="text-gray-600">
                        <strong>Status:</strong> {request.status}
                      </p>
                      <p className="text-gray-600">
                        <strong>Deadline:</strong>{" "}
                        {new Date(
                          request.confirmationDeadline
                        ).toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        <strong>Created By:</strong>{" "}
                        {request.createdBy?.firstName}{" "}
                        {request.createdBy?.lastName}
                      </p>
                      <div className="mt-2">
                        <strong>Team Members:</strong>
                        <ul className="list-disc ml-4 text-gray-700">
                          {request.teamRequestMembers.map((member) => (
                            <li key={member.id}>
                              {member.user?.firstName} {member.user?.lastName} -{" "}
                              {member.status}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
