// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskAttachments.tsx
"use client";

import { FileUrl } from "@/types/entities/task";
import { formatDistance } from "date-fns";

interface TaskAttachmentsProps {
  files: FileUrl[];
  onAddFile: (file: File) => void;
  onRemoveFile: (fileId: string) => void;
}

export default function TaskAttachments({
  files,
  onAddFile,
  onRemoveFile,
}: TaskAttachmentsProps) {
  // Only render if there are attachments or we want to show the section anyway
  if (files.length === 0) return null;

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="mr-2">📎</span>
        Attachments ({files.length})
      </h3>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-start border-b border-gray-200 pb-2"
          >
            {/* File preview/icon */}
            <div className="mr-3 mt-1">
              {file.fileType.startsWith("image/") ? (
                <img
                  src={file.fileUrl}
                  alt={file.fileName}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-xs">File</span>
                </div>
              )}
            </div>

            {/* File details */}
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium text-sm">{file.fileName}</span>
                <span className="text-xs text-gray-500">
                  {formatDistance(new Date(file.createdAt || ""), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {(file.fileSize / 1024).toFixed(1)} KB
              </div>
              <div className="mt-1 flex space-x-2">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  Download
                </a>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <label className="cursor-pointer inline-block">
          <div className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm">
            Add Attachment
          </div>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onAddFile(file);
            }}
          />
        </label>
      </div>
    </div>
  );
}
