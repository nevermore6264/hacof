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
import { taskService } from "@/services/task.service";
import { taskLabelService } from "@/services/taskLabel.service";
import { taskAssigneeService } from "@/services/taskAssignee.service";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    try {
      setIsLoading(true);
      setError(null);

      // Update task information (title, description, dueDate)
      const { data: updatedTaskData } = await taskService.updateTaskInformation(
        task.id,
        {
          title: updatedTask.title,
          description: updatedTask.description || "",
          boardListId: updatedTask.boardListId,
          dueDate: updatedTask.dueDate || "",
        }
      );

      // Close the modal
      onClose();
    } catch (err) {
      setError("Failed to update task. Please try again.");
      console.error("Error updating task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await taskService.deleteTask(task.id);

      // Close the modal
      onClose();
    } catch (err) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-2 bg-red-50 text-red-600 text-sm border-b border-red-100">
            {error}
          </div>
        )}

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
                  onChange={(labels) => {
                    // We'll handle this in the TaskLabels component
                  }}
                  taskId={task.id}
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
                  onChange={(assignees) => {
                    // We'll handle this in the TaskAssignees component
                  }}
                  taskId={task.id}
                />
              </div>

              {/* Actions */}
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Actions
                </h3>
                <button
                  className="w-full text-left text-sm py-1 px-2 text-red-600 hover:bg-gray-200 rounded"
                  onClick={handleDeleteTask}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
