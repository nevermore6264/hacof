// src/app/hackathon/[id]/team/[teamId]/board/_components/KanbanBoard.tsx
"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCorners, DragEndEvent } from "@dnd-kit/core";
import { Board } from "@/types/entities/board";
import { Team } from "@/types/entities/team";
import KanbanColumn from "./KanbanColumn";
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
  const { setColumns, moveTask } = useKanbanStore();

  // Check if current user is board owner
  const isOwner = board?.owner?.id === user?.id;

  // Transform board data to kanban format when board data changes
  useEffect(() => {
    if (board && board.boardLists) {
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
  }, [board, setColumns]);

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the source column of the task
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{board.name}</h1>
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
                    boardUser.user?.avatarUrl ||
                    "https://via.placeholder.com/40"
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

          {/* Invite Button - Only shown to owner */}
          {isOwner && (
            <button
              onClick={() => setInviteModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium"
            >
              Manage Users
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {useKanbanStore.getState().columns.map((column) => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
      </DndContext>

      {/* User Management Modal */}
      {isInviteModalOpen && (
        <BoardUserManagement
          board={board}
          team={team}
          isOpen={isInviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
        />
      )}
    </div>
  );
}
