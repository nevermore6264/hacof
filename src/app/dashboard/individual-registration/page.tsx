// src/app/dashboard/individual-registration/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchMockIndividualRegistrations } from "./_mocks/fetchMockIndividualRegistrations";
import { useAuth } from "@/hooks/useAuth_v0";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

// Mock API function to delete individual registration
const deleteMockIndividualRegistration = (
  registrationId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API call success with 90% probability
      if (Math.random() > 0.1) {
        resolve();
      } else {
        reject(new Error("Failed to delete registration"));
      }
    }, 500);
  });
};

export default function IndividualRegistrationPage() {
  const { user } = useAuth();
  const [individualRegistrations, setIndividualRegistrations] = useState<
    IndividualRegistrationRequest[]
  >([]);
  const [expandedHackathons, setExpandedHackathons] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch individual registrations
      fetchMockIndividualRegistrations(user.username || "").then(
        setIndividualRegistrations
      );
    }
  }, [user]);

  const toggleExpand = (hackathonId: string) => {
    setExpandedHackathons((prev) => ({
      ...prev,
      [hackathonId]: !prev[hackathonId],
    }));
  };

  const handleDeleteRegistration = async (registrationId: string) => {
    setIsLoading(true);
    try {
      // Call mock API to delete registration
      await deleteMockIndividualRegistration(registrationId);

      // Update local state by removing the deleted registration
      setIndividualRegistrations((prevRegistrations) =>
        prevRegistrations.filter(
          (registration) => registration.id !== registrationId
        )
      );
    } catch (error) {
      console.error("Failed to delete registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group individual registrations by hackathon
  const groupedRegistrations = individualRegistrations.reduce(
    (acc, registration) => {
      if (!registration.hackathon) return acc;
      const hackathonId = registration.hackathon.id;
      if (!acc[hackathonId]) {
        acc[hackathonId] = {
          title: registration.hackathon.title,
          registrations: [],
        };
      }
      acc[hackathonId].registrations.push(registration);
      return acc;
    },
    {} as Record<
      string,
      { title: string; registrations: IndividualRegistrationRequest[] }
    >
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600";
      case "REJECTED":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <div className="mt-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Individual Registrations</h1>

        {Object.entries(groupedRegistrations).length > 0 ? (
          Object.entries(groupedRegistrations).map(
            ([hackathonId, { title, registrations }]) => {
              return (
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
                      {registrations.map((registration) => (
                        <div
                          key={registration.id}
                          className="border rounded-lg p-3 bg-gray-50"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-600">
                                <strong>Registration ID:</strong>{" "}
                                {registration.id}
                              </p>
                              <p className="text-gray-600">
                                <strong>Status:</strong>{" "}
                                <span
                                  className={getStatusColor(
                                    registration.status
                                  )}
                                >
                                  {registration.status}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                <strong>Created:</strong>{" "}
                                {formatDate(registration.createdAt)}
                              </p>
                              <p className="text-gray-600">
                                <strong>Last Updated:</strong>{" "}
                                {formatDate(registration.updatedAt)}
                              </p>
                            </div>

                            {registration.status === "PENDING" && (
                              <button
                                onClick={() =>
                                  handleDeleteRegistration(registration.id)
                                }
                                disabled={isLoading}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-500 hover:bg-red-600 rounded-md text-white"
                                title="Cancel registration"
                              >
                                <Trash2 size={16} />
                                <span>Cancel</span>
                              </button>
                            )}
                          </div>

                          {registration.reviewedBy && (
                            <div className="mt-2 p-2 bg-gray-100 rounded">
                              <p className="text-gray-700">
                                <strong>Reviewed by:</strong>{" "}
                                {registration.reviewedBy.firstName}{" "}
                                {registration.reviewedBy.lastName}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-600">
            You don't have any individual registrations yet.
          </div>
        )}
      </div>
    </div>
  );
}
