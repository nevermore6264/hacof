// src/app/hackathon/[id]/team/[teamId]/board/_components/KanbanColumn.tsx
"use client";

import { useDroppable } from "@dnd-kit/core";
import KanbanTask from "./KanbanTask";
import { Column } from "@/store/kanbanStore";

interface KanbanColumnProps {
  column: Column;
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-4 rounded-xl shadow-lg w-full min-h-[400px]"
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{column.title}</h2>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-500">
            {column.tasks.length}
          </span>
          <button className="text-gray-400 hover:text-gray-600">•••</button>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {column.tasks.map((task) => (
          <KanbanTask key={task.id} task={task} />
        ))}
      </div>

      {/* Add Card */}
      <button className="w-full text-gray-500 mt-4 flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
        <span className="text-xl">+</span>
        <span>Add a card</span>
      </button>
    </div>
  );
}
