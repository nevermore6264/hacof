// src/app/hackathon/[id]/team/[teamId]/board/_components/SubmissionTab.tsx
"use client";

import { useState, useEffect } from "react";
import { Submission } from "@/types/entities/submission";

interface Props {
  round: string;
  submissions: Submission[];
  loading: boolean;
  roundStartTime: string;
  roundEndTime: string;
}

export default function SubmissionTab({
  round,
  submissions,
  loading,
  roundStartTime,
  roundEndTime,
}: Props) {
  const [timeLeft, setTimeLeft] = useState("");
  const [roundStatus, setRoundStatus] = useState("");

  useEffect(() => {
    const now = Date.now();
    const startTime = new Date(roundStartTime).getTime();
    const endTime = new Date(roundEndTime).getTime();

    if (now < startTime) {
      setRoundStatus(
        `Round starts at: ${new Date(roundStartTime).toLocaleString()}`
      );
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const distance = endTime - Date.now();

      if (distance < 0) {
        setTimeLeft("Deadline Passed");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [roundStartTime, roundEndTime]);

  if (loading) return <p>Loading submission...</p>;
  if (
    !submissions.length ||
    !submissions.some((sub) => sub.status === "SUBMITTED")
  ) {
    return <p className="text-red-500">No submission yet for this round.</p>;
  }

  const submission = submissions.find((sub) => sub.status === "SUBMITTED");

  return (
    <div>
      {roundStatus ? (
        <p className="text-blue-500 font-semibold">{roundStatus}</p>
      ) : (
        <>
          <h2 className="text-lg font-semibold">
            Your team has submitted successfully
          </h2>
          <p className="mt-2 font-semibold">
            Your submission:{" "}
            <span className="font-bold">{`${submission?.createdBy.firstName} ${submission?.createdBy.lastName}`}</span>
          </p>

          {/* Submission Files */}
          <div className="mt-3">
            {submission?.fileUrls.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2"
              >
                <p className="truncate">{file.fileName}</p>
                <a
                  href={file.fileUrl}
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </div>
            ))}
          </div>

          {/* Timer & Resubmit */}
          <p className="mt-4 text-red-600 font-bold text-lg">
            Time left: {timeLeft}
          </p>
          <p className="text-lg font-bold">
            Submit due date: {new Date(roundEndTime).toLocaleString()}
          </p>

          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Resubmit
          </button>
        </>
      )}
    </div>
  );
}
