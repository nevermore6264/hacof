// src/app/hackathon/[id]/team/[teamId]/board/_components/KanbanColumn.tsx
"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KanbanTask from "./KanbanTask";
import { Column } from "@/store/kanbanStore";
import { useKanbanStore } from "@/store/kanbanStore";

interface KanbanColumnProps {
  column: Column;
  isActive?: boolean;
}

export default function KanbanColumn({ column, isActive }: KanbanColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setColumnName] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);

  const { setNodeRef: droppableRef } = useDroppable({ id: column.id });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveEdit = async () => {
    if (columnName.trim() !== "") {
      await useKanbanStore.getState().updateList(column.id, columnName);
      setIsEditing(false);
    }
  };

  const handleDeleteColumn = async () => {
    if (
      confirm(`Are you sure you want to delete the "${column.title}" list?`)
    ) {
      await useKanbanStore.getState().deleteList(column.id);
    }
    setShowMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-gray-100 p-4 rounded-xl shadow-lg w-full min-h-[400px] ${
        isActive ? "opacity-50" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex w-full space-x-2">
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") {
                  setColumnName(column.title);
                  setIsEditing(false);
                }
              }}
            />
            <button
              onClick={handleSaveEdit}
              className="px-2 py-1 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setColumnName(column.title);
                setIsEditing(false);
              }}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <h2
              className="text-lg font-bold cursor-pointer"
              onClick={() => setIsEditing(true)}
              {...listeners}
            >
              {column.title}
            </h2>
            <span className="ml-2 text-sm text-gray-500">
              {column.tasks.length}
            </span>
          </div>
        )}

        <div className="relative">
          <button
            className="text-gray-400 hover:text-gray-600 p-1"
            onClick={() => setShowMenu(!showMenu)}
          >
            •••
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                >
                  Edit List
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleDeleteColumn}
                >
                  Delete List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Droppable area for tasks */}
      <div ref={droppableRef} className="space-y-3 min-h-[300px]">
        {column.tasks.map((task) => (
          <KanbanTask key={task.id} task={task} />
        ))}
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => {
          // TODO: Implement add task functionality
          console.log("Adding new task to", column.id);
        }}
        className="w-full text-gray-500 mt-4 flex items-center space-x-2 p-2 hover:bg-gray-200 rounded"
      >
        <span className="text-xl">+</span>
        <span>Add a card</span>
      </button>
    </div>
  );
}
