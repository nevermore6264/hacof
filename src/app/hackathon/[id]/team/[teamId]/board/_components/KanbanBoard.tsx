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

interface KanbanBoardProps {
  board: Board | null;
  team: Team | null;
}

export default function KanbanBoard({ board, team }: KanbanBoardProps) {
  const { user } = useAuth();
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { setBoard, setColumns, moveTask, moveList } = useKanbanStore();

  // Check if current user is board owner
  const isOwner = board?.owner?.id == user?.id;

  // Transform board data to kanban format when board data changes
  useEffect(() => {
    if (board) {
      setBoard(board);
      setBoardName(board.name);
      setBoardDescription(board.description || "");

      if (board.boardLists) {
        const formattedColumns = board.boardLists.map((list) => ({
          id: list.id,
          title: list.name,
          tasks: (list.tasks || []).map((task) => ({
            id: task.id,
            title: task.title,
            status: list.name.toLowerCase().replace(/\s+/g, "-"),
            description: task.description || "",
            dueDate: task.dueDate,
            assignees: task.assignees?.map((assignee) => assignee.user) || [],
            labels: task.taskLabels?.map((tl) => tl.boardLabel) || [],
          })),
        }));

        setColumns(formattedColumns);
      }
    }
  }, [board, setBoard, setColumns]);

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  // Handle drag over event
  const handleDragOver = (event: DragOverEvent) => {
    // This would be used for column sorting if needed
  };

  // Handle drag end event
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

    // This is a task being dragged
    const sourceColumnId = useKanbanStore
      .getState()
      .columns.find((column) =>
        column.tasks.some((task) => task.id === activeId)
      )?.id;

    if (sourceColumnId && sourceColumnId !== overId) {
      moveTask(activeId, sourceColumnId, overId);
    }
  };

  if (!board) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading board data...
      </div>
    );
  }

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
          items={useKanbanStore.getState().columns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useKanbanStore.getState().columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                isActive={activeId === column.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add New List Button */}
      <div className="mt-4">
        <button
          onClick={() => useKanbanStore.getState().createList("New List")}
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
