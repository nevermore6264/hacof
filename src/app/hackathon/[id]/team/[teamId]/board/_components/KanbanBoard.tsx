// src/app/hackathon/[id]/team/[teamId]/board/_components/KanbanBoard.tsx
"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Board } from "@/types/entities/board";
import { Team } from "@/types/entities/team";
import KanbanColumn from "./KanbanColumn";
import BoardHeader from "./BoardHeader";
import { useAuth } from "@/hooks/useAuth_v0";
import BoardUserManagement from "./BoardUserManagement";
import { useKanbanStore } from "@/store/kanbanStore";
import { BoardLabel } from "@/types/entities/boardLabel";
import { boardLabelService } from "@/services/boardLabel.service";
import { boardListService } from "@/services/boardList.service";
import { boardUserService } from "@/services/boardUser.service";
import { taskService } from "@/services/task.service";
import { fileUrlService } from "@/services/fileUrl.service";
import { taskLabelService } from "@/services/taskLabel.service";
import { taskCommentService } from "@/services/taskComment.service";
import { taskAssigneeService } from "@/services/taskAssignee.service";

interface KanbanBoardProps {
  board: Board | null;
  team: Team | null;
  isLoading: boolean;
}

export default function KanbanBoard({
  board,
  team,
  isLoading,
}: KanbanBoardProps) {
  const { user } = useAuth();
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { setBoard, setColumns, moveTask, moveList } = useKanbanStore();
  const [loading, setLoading] = useState(true);
  const [currentLoadingList, setCurrentLoadingList] = useState<string | null>(
    null
  );

  // Check if current user is board owner
  const isOwner = board?.owner?.id == user?.id;

  // Load board data progressively
  useEffect(() => {
    if (!board || isLoading || !team) return;

    const loadBoardData = async () => {
      setLoading(true);
      setBoardName(board.name);
      setBoardDescription(board.description || "");
      setBoard(board);

      try {
        // Create a user map from team members for quick access
        const teamUsersMap = {};

        // Add all team members to the map
        team.teamMembers?.forEach((member) => {
          if (member.user) {
            teamUsersMap[member.user.id] = member.user;
          }
        });

        // Load board users first (for header display)
        const { data: boardUsers } =
          await boardUserService.getBoardUsersByBoardId(board.id);
        setBoard({
          ...board,
          boardUsers,
        });

        // Load board labels (needed for task labels)
        const { data: boardLabels } =
          await boardLabelService.getBoardLabelsByBoardId(board.id);
        const boardLabelsMap = boardLabels.reduce(
          (map, label) => {
            map[label.id] = label;
            return map;
          },
          {} as Record<string, BoardLabel>
        );

        // Load board lists (structure only)
        const { data: boardLists } =
          await boardListService.getBoardListsByBoardId(board.id);

        // Sort board lists by position before mapping to columns
        const sortedBoardLists = [...boardLists].sort(
          (a, b) => a.position - b.position
        );

        // Set initial columns with empty tasks (to show skeleton UI)
        const initialColumns = sortedBoardLists.map((list) => ({
          id: list.id,
          title: list.name,
          position: list.position,
          tasks: [],
        }));

        setColumns(initialColumns);
        setLoading(false);

        // Load tasks for each list progressively
        for (const list of sortedBoardLists) {
          setCurrentLoadingList(list.id);
          const { data: baseTasks } = await taskService.getTasksByBoardListId(
            list.id
          );

          // Process tasks in smaller batches if there are many
          const batchSize = 5;
          const enhancedTasks = [];

          for (let i = 0; i < baseTasks.length; i += batchSize) {
            const batch = baseTasks.slice(i, i + batchSize);
            const batchResults = await Promise.all(
              batch.map(async (task) => {
                // Fetch detailed information for each task
                const [
                  { data: fileUrls },
                  { data: taskLabels },
                  { data: comments },
                  { data: taskAssignees },
                ] = await Promise.all([
                  fileUrlService.getFileUrlsByTaskId(task.id),
                  taskLabelService.getTaskLabelsByTaskId(task.id),
                  taskCommentService.getTaskCommentsByTaskId(task.id),
                  taskAssigneeService.getTaskAssigneesByTaskId(task.id),
                ]);

                // Enhance taskLabels with their associated boardLabel information
                const enhancedTaskLabels = taskLabels.map((taskLabel) => ({
                  ...taskLabel,
                  boardLabel: taskLabel.boardLabelId
                    ? boardLabelsMap[taskLabel.boardLabelId]
                    : undefined,
                }));

                // Map task assignees (which now only contain user IDs) to the actual user data from teamUsersMap
                const enhancedAssignees = taskAssignees.map((assignee) => ({
                  ...assignee,
                  user: assignee.user?.id
                    ? teamUsersMap[assignee.user.id]
                    : undefined,
                }));

                // Return formatted task for Kanban display
                return {
                  id: task.id,
                  title: task.title,
                  status: list.name.toLowerCase().replace(/\s+/g, "-"),
                  description: task.description || "",
                  dueDate: task.dueDate,
                  position: task.position, // Make sure the position is included
                  assignees:
                    enhancedAssignees
                      ?.map((assignee) => assignee.user)
                      .filter(Boolean) || [],
                  labels:
                    enhancedTaskLabels
                      ?.map((tl) => tl.boardLabel)
                      .filter(Boolean) || [],
                  fileUrls,
                  comments,
                };
              })
            );

            enhancedTasks.push(...batchResults);

            // Sort tasks by position before updating the column
            const sortedEnhancedTasks = [...enhancedTasks].sort(
              (a, b) => a.position - b.position
            );

            // Update the column with the tasks processed so far
            const updatedColumns = useKanbanStore
              .getState()
              .columns.map((col) =>
                col.id === list.id
                  ? { ...col, tasks: sortedEnhancedTasks }
                  : col
              );
            setColumns(updatedColumns);
          }
        }

        setCurrentLoadingList(null);
      } catch (error) {
        console.error("Error loading board data:", error);
      }
    };

    loadBoardData();
  }, [board, isLoading, team, setBoard, setColumns]);

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  // Update the handleDragOver function
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if this is a column being dragged over
    const isActiveColumn = useKanbanStore
      .getState()
      .columns.some((col) => col.id === activeId);

    const isOverColumn = useKanbanStore
      .getState()
      .columns.some((col) => col.id === overId);

    // If we're dragging a column over another column, it's handled elsewhere
    if (isActiveColumn && isOverColumn) return;

    // Find the active task
    const activeTask = useKanbanStore
      .getState()
      .columns.flatMap((col) => col.tasks)
      .find((task) => task.id === activeId);

    // Find the task or column we're dragging over
    const overTask = useKanbanStore
      .getState()
      .columns.flatMap((col) => col.tasks)
      .find((task) => task.id === overId);

    // If the target is not a task (might be a column), return
    if (!activeTask) return;

    // If we're dragging over a column directly
    if (isOverColumn) {
      // Move the task to the end of the target column
      const sourceColumnId = useKanbanStore
        .getState()
        .columns.find((column) =>
          column.tasks.some((task) => task.id === activeId)
        )?.id;

      if (sourceColumnId && sourceColumnId !== overId) {
        useKanbanStore.getState().moveTask(activeId, sourceColumnId, overId);
      }
      return;
    }

    // If we're not dragging over another task, return
    if (!overTask) return;

    // Find the columns for both tasks
    const overColumn = useKanbanStore
      .getState()
      .columns.find((col) => col.tasks.some((task) => task.id === overId));

    const activeColumn = useKanbanStore
      .getState()
      .columns.find((col) => col.tasks.some((task) => task.id === activeId));

    if (!overColumn || !activeColumn) return;

    // If tasks are in different columns, move the task to the new column
    if (activeColumn.id !== overColumn.id) {
      useKanbanStore
        .getState()
        .moveTask(activeId, activeColumn.id, overColumn.id);
      return;
    }

    // If tasks are in the same column, reorder tasks
    const overTaskIndex = overColumn.tasks.findIndex(
      (task) => task.id === overId
    );

    // Reorder tasks in the column
    useKanbanStore
      .getState()
      .reorderTasksInColumn(overColumn.id, activeId, overTaskIndex);
  };

  // Update the handleDragEnd function to include task sorting
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if this is a column being dragged
    const isColumn = useKanbanStore
      .getState()
      .columns.some((col) => col.id === activeId);

    if (isColumn) {
      // Find current and target index
      const columns = useKanbanStore.getState().columns;
      const currentIndex = columns.findIndex((col) => col.id === activeId);
      const targetIndex = columns.findIndex((col) => col.id === overId);

      if (currentIndex !== targetIndex) {
        moveList(activeId, targetIndex);
      }
      return;
    }

    // Find the active task
    const activeTask = useKanbanStore
      .getState()
      .columns.flatMap((col) => col.tasks)
      .find((task) => task.id === activeId);

    if (!activeTask) return;

    // Check if we're dropping on a column
    const isOverColumn = useKanbanStore
      .getState()
      .columns.some((col) => col.id === overId);

    if (isOverColumn) {
      // This is a task being dragged to a column
      const sourceColumnId = useKanbanStore
        .getState()
        .columns.find((column) =>
          column.tasks.some((task) => task.id === activeId)
        )?.id;

      if (sourceColumnId && sourceColumnId !== overId) {
        moveTask(activeId, sourceColumnId, overId);
      }
    } else {
      // This is a task being dragged over another task
      // The reordering is handled in handleDragOver
    }
  };

  // Show loading skeleton if board data is still loading
  if (!board || isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Header */}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-100 p-4 rounded-xl shadow-lg w-full min-h-[400px]"
            >
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-20 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sort columns by position before rendering
  const sortedColumns = [...useKanbanStore.getState().columns].sort(
    (a, b) => a.position - b.position
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <BoardHeader
        board={board}
        isOwner={isOwner}
        onOpenUserManagement={() => setInviteModalOpen(true)}
        onEdit={() => setIsEditingBoard(true)}
      />

      {/* Kanban Board */}
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedColumns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                isActive={activeId === column.id}
                isLoading={loading || currentLoadingList === column.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add New List Button */}
      <div className="mt-4">
        <button
          onClick={() => {
            const nextPosition = sortedColumns.length;
            useKanbanStore.getState().createList("New List", nextPosition);
          }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center"
        >
          <span className="mr-2">+</span>
          <span>Add New List</span>
        </button>
      </div>

      {/* User Management Modal */}
      {isInviteModalOpen && (
        <BoardUserManagement
          board={board}
          team={team}
          isOpen={isInviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          isOwner={isOwner}
        />
      )}

      {/* Board Edit Modal */}
      {isEditingBoard && (
        <BoardEditModal
          boardName={boardName}
          boardDescription={boardDescription}
          onSave={async () => {
            await useKanbanStore
              .getState()
              .updateBoardDetails(boardName, boardDescription);
            setIsEditingBoard(false);
          }}
          onCancel={() => {
            setBoardName(board.name);
            setBoardDescription(board.description || "");
            setIsEditingBoard(false);
          }}
          onChangeName={setBoardName}
          onChangeDescription={setBoardDescription}
        />
      )}
    </div>
  );
}

interface BoardEditModalProps {
  boardName: string;
  boardDescription: string;
  onSave: () => void;
  onCancel: () => void;
  onChangeName: (name: string) => void;
  onChangeDescription: (description: string) => void;
}

function BoardEditModal({
  boardName,
  boardDescription,
  onSave,
  onCancel,
  onChangeName,
  onChangeDescription,
}: BoardEditModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Board</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Board Name
          </label>
          <input
            type="text"
            value={boardName}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={boardDescription}
            onChange={(e) => onChangeDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
