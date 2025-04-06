// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskDueDate.tsx
"use client";

import { format, isPast, parseISO } from "date-fns";
import { useState } from "react";

interface TaskDueDateProps {
  dueDate?: string;
  onChange: (dueDate?: string) => void;
}

export default function TaskDueDate({ dueDate, onChange }: TaskDueDateProps) {
  const [isSelecting, setIsSelecting] = useState(false);

  const formattedDate = dueDate ? format(parseISO(dueDate), "MMM d, yyyy") : "";

  const isPastDue = dueDate && isPast(parseISO(dueDate));

  return (
    <div className="mt-2">
      <button
        className="w-full text-left text-sm py-1 px-2 text-gray-700 hover:bg-gray-200 rounded flex items-center"
        onClick={() => setIsSelecting(!isSelecting)}
      >
        <span className="mr-2">🗓️</span>
        <span>Due Date</span>
      </button>

      {isSelecting && (
        <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm">
          <input
            type="date"
            value={dueDate ? dueDate.split("T")[0] : ""}
            onChange={(e) => {
              const newDate = e.target.value
                ? new Date(e.target.value).toISOString()
                : undefined;
              onChange(newDate);
            }}
            className="w-full p-1 border border-gray-300 rounded text-sm"
          />
          <div className="mt-2 flex justify-between">
            <button
              onClick={() => onChange(undefined)}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Remove
            </button>
            <button
              onClick={() => setIsSelecting(false)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {dueDate && !isSelecting && (
        <div className="mt-1 ml-7 text-xs">
          <span className={isPastDue ? "text-red-500" : "text-gray-600"}>
            {formattedDate}
          </span>
        </div>
      )}
    </div>
  );
}
