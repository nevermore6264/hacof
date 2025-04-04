// src/app/hackathon/[id]/team/[teamId]/board/_components/RewardListTab.tsx
"use client";

import { useEffect, useState } from "react";
import { HackathonResult } from "@/types/entities/hackathonResult";
import { hackathonResultService } from "@/services/hackathonResult.service";
import { useApiModal } from "@/hooks/useApiModal";

interface RewardListTabProps {
  hackathonId: string;
}

export default function RewardListTab({ hackathonId }: RewardListTabProps) {
  const [results, setResults] = useState<HackathonResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Use the API modal hook for error handling
  const { showError } = useApiModal();

  useEffect(() => {
    const fetchHackathonResults = async () => {
      setLoading(true);
      try {
        // Use the real service instead of mock data
        const response =
          await hackathonResultService.getHackathonResultsByHackathonId(
            hackathonId
          );

        if (response.data) {
          setResults(response.data);
        } else {
          throw new Error(
            response.message || "Failed to fetch reward recipients"
          );
        }
      } catch (error) {
        console.error("Error fetching hackathon results:", error);
        showError(
          "Failed to Load Rewards",
          error instanceof Error
            ? error.message
            : "An unknown error occurred while fetching reward data"
        );
        // Initialize with empty array on error
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (hackathonId) {
      fetchHackathonResults();
    }
  }, [hackathonId, showError]);

  // Add a sort function to ensure results are displayed in order of placement
  const sortedResults = [...results].sort(
    (a, b) => (a.placement || 999) - (b.placement || 999)
  );

  if (loading) {
    return <p className="text-gray-500">Loading rewards...</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-4">Reward Recipient List</h2>

      {sortedResults.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Team
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Award
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedResults.map((result, index) => (
                <tr
                  key={result.id || index}
                  className={index < 3 ? "bg-blue-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {result.placement || index + 1}
                      {result.placement === 1 && " 🥇"}
                      {result.placement === 2 && " 🥈"}
                      {result.placement === 3 && " 🥉"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {result.team?.name || "Unknown Team"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {result.totalScore?.toFixed(1) || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {result.award || "No award"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">
            No reward recipients available for this hackathon yet.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Results will be published after judging is completed.
          </p>
        </div>
      )}
    </div>
  );
}
