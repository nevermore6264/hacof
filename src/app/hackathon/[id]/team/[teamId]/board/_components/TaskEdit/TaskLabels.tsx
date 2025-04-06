// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskLabels.tsx
"use client";

import { useState } from "react";
import { BoardLabel } from "@/types/entities/boardLabel";

interface TaskLabelsProps {
  selectedLabels: BoardLabel[];
  availableLabels: BoardLabel[];
  onChange: (labels: BoardLabel[]) => void;
}

export default function TaskLabels({
  selectedLabels,
  availableLabels,
  onChange,
}: TaskLabelsProps) {
  const [isSelecting, setIsSelecting] = useState(false);

  const toggleLabel = (label: BoardLabel) => {
    const isSelected = selectedLabels.some((l) => l.id === label.id);
    let newLabels: BoardLabel[];

    if (isSelected) {
      newLabels = selectedLabels.filter((l) => l.id !== label.id);
    } else {
      newLabels = [...selectedLabels, label];
    }

    onChange(newLabels);
  };

  return (
    <div>
      <button
        className="w-full text-left text-sm py-1 px-2 text-gray-700 hover:bg-gray-200 rounded flex items-center"
        onClick={() => setIsSelecting(!isSelecting)}
      >
        <span className="mr-2">🏷️</span>
        <span>Labels</span>
      </button>

      {/* Display selected labels */}
      {selectedLabels.length > 0 && !isSelecting && (
        <div className="flex flex-wrap mt-1 ml-7 gap-1">
          {selectedLabels.map((label) => (
            <div
              key={label.id}
              className="h-2 w-10 rounded"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}

      {/* Label selector */}
      {isSelecting && (
        <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="max-h-48 overflow-y-auto">
            {availableLabels.map((label) => {
              const isSelected = selectedLabels.some((l) => l.id === label.id);
              return (
                <div
                  key={label.id}
                  className="flex items-center mb-1 cursor-pointer hover:bg-gray-100 rounded p-1"
                  onClick={() => toggleLabel(label)}
                >
                  <div
                    className="w-8 h-6 rounded mr-2"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="text-sm">{label.name}</span>
                  {isSelected && <span className="ml-auto">✓</span>}
                </div>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setIsSelecting(false)}
              className="w-full text-center text-xs text-blue-600 hover:text-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
