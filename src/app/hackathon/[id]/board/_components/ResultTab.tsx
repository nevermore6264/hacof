// src/app/hackathon/[id]/board/_components/ResultTab.tsx
"use client";

import { useState } from "react";

// Mock Data
const mockResults = [
  { criteria: "Innovation", score: 8, max: 10 },
  { criteria: "Implementation", score: 7, max: 10 },
  { criteria: "Presentation", score: 9, max: 10 },
];

export default function ResultTab({ round }: { round: string }) {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">{round} - Results</h2>
      {mockResults.length > 0 ? (
        <ul className="list-disc ml-6">
          {mockResults.map((result, index) => (
            <li key={index}>
              {result.criteria}: {result.score}/{result.max}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results available yet.</p>
      )}
    </div>
  );
}
