// src/app/hackathon/[id]/team/[teamId]/board/_components/KanbanTask.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import { format, isPast } from "date-fns";

interface TaskProps {
  id: string;
  title: string;
  status: string;
  description?: string;
  dueDate?: string;
  assignees?: any[];
  labels?: any[];
}

interface KanbanTaskProps {
  task: TaskProps;
}

export default function KanbanTask({ task }: KanbanTaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  // Format date and check if past due
  const formattedDate = task.dueDate
    ? format(new Date(task.dueDate), "MMM d")
    : null;

  const isPastDue = task.dueDate && isPast(new Date(task.dueDate));

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-white p-4 rounded-lg shadow-md cursor-grab space-y-2"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
    >
      {/* Task Title */}
      <p className="font-medium">{task.title}</p>

      {/* Task Description (if available) */}
      {task.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
      )}

      {/* Task Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}

      {/* Task Meta */}
      <div className="flex justify-between items-center text-sm text-gray-400">
        {/* Due Date */}
        {formattedDate && (
          <span
            className={`flex items-center gap-1 ${isPastDue ? "text-red-500" : ""}`}
          >
            <span>⏰</span>
            <span>{formattedDate}</span>
          </span>
        )}
      </div>

      {/* Task Assignees */}
      {task.assignees && task.assignees.length > 0 && (
        <div className="flex -space-x-2">
          {task.assignees.slice(0, 3).map((assignee) => (
            <img
              key={assignee.id}
              src={assignee.avatarUrl || "https://via.placeholder.com/30"}
              alt={`${assignee.firstName} ${assignee.lastName}`}
              className="w-6 h-6 rounded-full border-2 border-white"
              title={`${assignee.firstName} ${assignee.lastName}`}
            />
          ))}
          {task.assignees.length > 3 && (
            <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full border-2 border-white text-xs">
              +{task.assignees.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
