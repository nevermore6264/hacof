// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskAssignees.tsx
"use client";

import { useState } from "react";
import { User } from "@/types/entities/user";

interface TaskAssigneesProps {
  assignees: User[];
  availableMembers: User[];
  onChange: (assignees: User[]) => void;
}

export default function TaskAssignees({
  assignees,
  availableMembers,
  onChange,
}: TaskAssigneesProps) {
  const [isSelecting, setIsSelecting] = useState(false);

  const toggleAssignee = (user: User) => {
    const isAssigned = assignees.some((a) => a.id === user.id);
    let newAssignees: User[];

    if (isAssigned) {
      newAssignees = assignees.filter((a) => a.id !== user.id);
    } else {
      newAssignees = [...assignees, user];
    }

    onChange(newAssignees);
  };

  return (
    <div className="mt-2">
      <button
        className="w-full text-left text-sm py-1 px-2 text-gray-700 hover:bg-gray-200 rounded flex items-center"
        onClick={() => setIsSelecting(!isSelecting)}
      >
        <span className="mr-2">👤</span>
        <span>Members</span>
      </button>

      {/* Display assigned members */}
      {assignees.length > 0 && !isSelecting && (
        <div className="flex flex-wrap mt-1 ml-7 gap-1">
          {assignees.map((user) => (
            <img
              key={user.id}
              src={user.avatarUrl || "https://via.placeholder.com/30"}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-6 h-6 rounded-full border border-white"
              title={`${user.firstName} ${user.lastName}`}
            />
          ))}
        </div>
      )}

      {/* Member selector */}
      {isSelecting && (
        <div className="mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-sm">
          <div className="max-h-48 overflow-y-auto">
            {availableMembers.map((user) => {
              const isAssigned = assignees.some((a) => a.id === user.id);
              return (
                <div
                  key={user.id}
                  className="flex items-center mb-1 cursor-pointer hover:bg-gray-100 rounded p-1"
                  onClick={() => toggleAssignee(user)}
                >
                  <img
                    src={user.avatarUrl || "https://via.placeholder.com/30"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-sm">{`${user.firstName} ${user.lastName}`}</span>
                  {isAssigned && <span className="ml-auto">✓</span>}
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
