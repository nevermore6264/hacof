// src/app/hackathon/[id]/team/[teamId]/board/_components/BoardHeader.tsx
"use client";

import { Board } from "@/types/entities/board";

interface BoardHeaderProps {
  board: Board;
  isOwner: boolean;
  onOpenUserManagement: () => void;
  onEdit: () => void;
}

export default function BoardHeader({
  board,
  isOwner,
  onOpenUserManagement,
  onEdit,
}: BoardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">{board.name}</h1>
          {isOwner && (
            <button
              onClick={onEdit}
              className="ml-2 text-gray-500 hover:text-gray-700"
              title="Edit board"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          )}
        </div>
        <p className="text-gray-500">{board.description}</p>
      </div>
      <div className="flex items-center space-x-4">
        {/* Avatars */}
        <div className="flex -space-x-2">
          {board.boardUsers
            ?.filter((bu) => !bu.isDeleted)
            .slice(0, 3)
            .map((boardUser) => (
              <img
                key={boardUser.id}
                src={
                  boardUser.user?.avatarUrl || "https://via.placeholder.com/40"
                }
                alt={`${boardUser.user?.firstName} ${boardUser.user?.lastName}`}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
          {(board.boardUsers?.filter((bu) => !bu.isDeleted).length || 0) >
            3 && (
            <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full border-2 border-white text-sm">
              +
              {(board.boardUsers?.filter((bu) => !bu.isDeleted).length || 0) -
                3}
            </span>
          )}
        </div>
        {/* Manage Users Button */}
        <button
          onClick={onOpenUserManagement}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium"
        >
          Manage Users
        </button>
      </div>
    </div>
  );
}
