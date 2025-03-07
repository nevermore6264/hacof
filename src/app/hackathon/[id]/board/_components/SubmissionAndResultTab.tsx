// src/app/hackathon/[id]/board/_components/SubmissionAndResultTab.tsx
"use client";

import { useState } from "react";
import SubmissionTab from "./SubmissionTab";
import ResultTab from "./ResultTab";
import RewardListTab from "./RewardListTab";

// Mock Data
const numberOfRounds = 3; // Example: 3 rounds
const roundTabs = Array.from(
  { length: numberOfRounds },
  (_, i) => `Round ${i + 1}`
);

export default function SubmissionAndResultTab() {
  const [activeRoundTab, setActiveRoundTab] = useState(roundTabs[0]);

  return (
    <div>
      {/* Round Navigation */}
      <div className="flex border-b border-gray-200">
        {roundTabs.map((round) => (
          <button
            key={round}
            className={`px-4 py-2 text-sm font-medium ${
              activeRoundTab === round
                ? "border-b-2 border-blue-500 text-blue-600"
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
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveRoundTab("Reward Recipient List")}
        >
          Reward Recipient List
        </button>
      </div>

      {/* Round Content */}
      <div className="mt-4 p-4 border rounded-lg bg-white shadow">
        {roundTabs.includes(activeRoundTab) && (
          <>
            <SubmissionTab round={activeRoundTab} />
            <ResultTab round={activeRoundTab} />
          </>
        )}
        {activeRoundTab === "Reward Recipient List" && <RewardListTab />}
      </div>
    </div>
  );
}
