// src/app/hackathon/[id]/team/[teamId]/board/_components/ResultTab.tsx
"use client";
import { useState, useEffect } from "react";
import { Submission } from "@/types/entities/submission";

interface ResultTabProps {
  roundId: string;
  roundTitle: string;
  submissions: Submission[];
}

export default function ResultTab({
  roundId,
  roundTitle,
  submissions,
}: ResultTabProps) {
  const [totalScore, setTotalScore] = useState(0);
  const [results, setResults] = useState<
    { criteria: string; score: number; max: number }[]
  >([]);

  useEffect(() => {
    if (!submissions.length) return;

    let total = 0;
    const extractedResults = submissions.flatMap((submission) =>
      submission.judgeSubmissions.flatMap((judgeSubmission) =>
        judgeSubmission.judgeSubmissionDetails.map((detail) => {
          total += detail.score;
          return {
            criteria: detail.roundMarkCriterion.name,
            score: detail.score,
            max: detail.roundMarkCriterion.maxScore,
          };
        })
      )
    );

    setTotalScore(total);
    setResults(extractedResults);
  }, [submissions]);

  if (!submissions.length)
    return <p className="text-gray-500">No results available.</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold">Mark Criteria for {roundTitle}:</h2>
      <ul className="mt-3 space-y-2">
        {results.map((result, index) => (
          <li key={index} className="border-b pb-2">
            <span className="font-semibold">{result.criteria}:</span>{" "}
            {result.score}/{result.max}
          </li>
        ))}
      </ul>

      <p className="mt-4 font-bold text-lg">Total Score: {totalScore}</p>
    </div>
  );
}
