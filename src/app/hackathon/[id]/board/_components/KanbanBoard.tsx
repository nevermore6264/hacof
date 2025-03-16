// src/app/hackathon/[id]/board/_components/KanbanBoard.tsx
"use client";

import { useKanbanStore } from "@/store/kanbanStore";
import { DndContext, closestCorners } from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard() {
  const { columns } = useKanbanStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Project Name</h1>
          <p className="text-gray-500">Goal of the board...</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Status Tag */}
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            Meeting with mentor
          </span>
          {/* Avatars */}
          <div className="flex -space-x-2">
            <img
              src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img
              src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img
              src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full border-2 border-white text-sm">
              +3
            </span>
          </div>
          {/* Invite Button */}
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
            Invite
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext collisionDetection={closestCorners}>
        <div className="grid grid-cols-3 gap-6">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
