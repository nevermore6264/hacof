// src/app/hackathon/[id]/board/_components/SubmissionTab.tsx
"use client";

import { useState } from "react";

// Mock Data
const mockSubmission = {
  submitted: true,
  files: ["submission1.pdf", "submission2.zip"],
  submittedAt: "2025-03-07",
};

export default function SubmissionTab({ round }: { round: string }) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting files:", uploadedFiles);
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">{round} - Submission</h2>

      {mockSubmission.submitted ? (
        <div className="mt-2">
          <p>✅ Submission already made on {mockSubmission.submittedAt}</p>
          <ul className="list-disc ml-6">
            {mockSubmission.files.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-2">
          <input type="file" multiple onChange={handleFileUpload} />
          <button
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
