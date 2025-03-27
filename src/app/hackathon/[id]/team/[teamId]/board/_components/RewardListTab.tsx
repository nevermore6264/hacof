"use client";

import { useEffect, useState } from "react";
import { fetchMockHackathonResults } from "../_mock/fetchMockHackathonResults";
import { HackathonResult } from "@/types/entities/hackathonResult";

interface RewardListTabProps {
  hackathonId: string;
}

export default function RewardListTab({ hackathonId }: RewardListTabProps) {
  const [results, setResults] = useState<HackathonResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockHackathonResults(hackathonId)
      .then((data) => {
        setResults(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [hackathonId]);

  if (loading) {
    return <p className="text-gray-500">Loading rewards...</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Reward Recipient List</h2>
      <ul className="list-disc ml-6">
        {results.length > 0 ? (
          results.map((result, index) => (
            <li key={index}>
              🏆 {result.team?.name}: {result.totalScore} points -{" "}
              {result.award || "No award"}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No results available.</p>
        )}
      </ul>
    </div>
  );
}
