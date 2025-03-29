// src/app/hackathon/[id]/team/[teamId]/board/_components/SubmissionAndResultTab.tsx
"use client";

import { useState, useEffect } from "react";
import SubmissionTab from "./SubmissionTab";
import ResultTab from "./ResultTab";
import RewardListTab from "./RewardListTab";
import { Round } from "@/types/entities/round";
import { fetchMockSubmissions } from "../_mock/fetchMockSubmissions";

interface Props {
  rounds: Round[];
  loading: boolean;
  hackathonId: string;
}

export default function SubmissionAndResultTab({
  rounds,
  loading,
  hackathonId,
}: Props) {
  const roundTabs = rounds.map((round) => round.roundTitle);
  const [activeRoundTab, setActiveRoundTab] = useState(roundTabs[0] || "");
  const [activeSubTab, setActiveSubTab] = useState("Submission");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const activeRound = rounds.find(
    (round) => round.roundTitle === activeRoundTab
  );
  const roundId = activeRound?.id;
  const roundStartTime = activeRound?.startTime || "";
  const roundEndTime = activeRound?.endTime || "";

  useEffect(() => {
    const loadSubmissions = async () => {
      if (!activeRoundTab) return;
      setSubmissionsLoading(true);
      const mockData = await fetchMockSubmissions(roundId, "mock-user-id");
      setSubmissions(mockData);
      setSubmissionsLoading(false);
    };

    loadSubmissions();
  }, [activeRoundTab]);

  if (loading) return <p>Loading rounds...</p>;
  if (rounds.length === 0)
    return <p className="text-gray-500">No rounds available.</p>;

  return (
    <div>
      {/* Round Navigation */}
      <div className="flex border-b border-gray-200 space-x-4">
        {roundTabs.map((round) => (
          <button
            key={round}
            className={`px-4 py-2 text-sm font-medium ${
              activeRoundTab === round
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveRoundTab(round)}
          >
            {round}
          </button>
        ))}
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeRoundTab === "Reward Recipient List"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveRoundTab("Reward Recipient List")}
        >
          Reward Recipient List
        </button>
      </div>

      {/* Conditionally Show Submission & Result Tabs */}
      {roundTabs.includes(activeRoundTab) ? (
        <div className="flex space-x-4 mt-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeSubTab === "Submission"
                ? "bg-gray-300 text-black font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveSubTab("Submission")}
          >
            Submission
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeSubTab === "Result"
                ? "bg-gray-300 text-black font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveSubTab("Result")}
          >
            Result
          </button>
        </div>
      ) : null}

      {/* Display Content Based on Active Tab */}
      <div className="mt-4 p-4 border rounded-lg bg-white shadow">
        {activeRoundTab === "Reward Recipient List" ? (
          <RewardListTab hackathonId={hackathonId} />
        ) : activeSubTab === "Submission" ? (
          <SubmissionTab
            round={activeRoundTab}
            submissions={submissions}
            loading={submissionsLoading}
            roundStartTime={roundStartTime}
            roundEndTime={roundEndTime}
          />
        ) : (
          <ResultTab
            roundId={roundId!}
            roundTitle={activeRoundTab}
            submissions={submissions}
          />
        )}
      </div>
    </div>
  );
}
