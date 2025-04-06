// src/app/hackathon/[id]/team/[teamId]/board/_components/TaskEdit/TaskEditModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types/entities/task";
import TaskTitle from "./TaskTitle";
import TaskDescription from "./TaskDescription";
import TaskDueDate from "./TaskDueDate";
import TaskLabels from "./TaskLabels";
import TaskAssignees from "./TaskAssignees";
import TaskAttachments from "./TaskAttachments";
import TaskComments from "./TaskComments";
import { BoardLabel } from "@/types/entities/boardLabel";
import { User } from "@/types/entities/user";
import { useKanbanStore } from "@/store/kanbanStore";

interface TaskEditModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  boardLabels?: BoardLabel[];
  teamMembers?: User[];
}

export default function TaskEditModal({
  task,
  isOpen,
  onClose,
  boardLabels = [],
  teamMembers = [],
}: TaskEditModalProps) {
  const [updatedTask, setUpdatedTask] = useState<Task>(task);

  // Handle escape key to close the modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSaveChanges = async () => {
    // Here you would call your API to update the task
    // For now just log the changes
    console.log("Saving task changes:", updatedTask);

    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {/* Task Title */}
          <TaskTitle
            title={updatedTask.title}
            onChange={(title) => setUpdatedTask({ ...updatedTask, title })}
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              {/* Task Description */}
              <TaskDescription
                description={updatedTask.description || ""}
                onChange={(description) =>
                  setUpdatedTask({ ...updatedTask, description })
                }
              />

              {/* Task Attachments */}
              <TaskAttachments
                files={updatedTask.fileUrls || []}
                onAddFile={() => {}}
                onRemoveFile={() => {}}
              />

              {/* Task Comments */}
              <TaskComments
                comments={updatedTask.comments || []}
                onAddComment={() => {}}
              />
            </div>

            <div className="space-y-4">
              {/* Task Actions */}
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Add to card
                </h3>

                {/* Task Labels */}
                <TaskLabels
                  selectedLabels={
                    updatedTask.taskLabels
                      ?.map((tl) => tl.boardLabel)
                      .filter(Boolean) || []
                  }
                  availableLabels={boardLabels}
                  onChange={(labels) => {}}
                />

                {/* Task Due Date */}
                <TaskDueDate
                  dueDate={updatedTask.dueDate}
                  onChange={(dueDate) =>
                    setUpdatedTask({ ...updatedTask, dueDate })
                  }
                />

                {/* Task Assignees */}
                <TaskAssignees
                  assignees={
                    updatedTask.assignees?.map((a) => a.user).filter(Boolean) ||
                    []
                  }
                  availableMembers={teamMembers}
                  onChange={(assignees) => {}}
                />
              </div>

              {/* Actions */}
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Actions
                </h3>
                <button
                  className="w-full text-left text-sm py-1 px-2 text-gray-700 hover:bg-gray-200 rounded"
                  onClick={() => {}}
                >
                  Move
                </button>
                <button
                  className="w-full text-left text-sm py-1 px-2 text-gray-700 hover:bg-gray-200 rounded"
                  onClick={() => {}}
                >
                  Copy
                </button>
                <button
                  className="w-full text-left text-sm py-1 px-2 text-red-600 hover:bg-gray-200 rounded"
                  onClick={() => {}}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
