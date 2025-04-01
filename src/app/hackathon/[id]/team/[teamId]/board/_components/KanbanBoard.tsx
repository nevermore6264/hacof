// src/app/hackathon/[id]/team/[teamId]/board/_components/KanbanBoard.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Board } from "@/types/entities/board";
import { BoardLabel } from "@/types/entities/boardLabel";
import { BoardUser, BoardUserRole } from "@/types/entities/boardUser";
import { BoardList } from "@/types/entities/boardList";
import { Task } from "@/types/entities/task";
import { Team } from "@/types/entities/team";
import { useAuth } from "@/hooks/useAuth_v0";
import KanbanColumn from "./KanbanColumn";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { User } from "@/types/entities/user";
import debounce from "lodash/debounce";

interface KanbanBoardProps {
  board?: Board;
  team?: Team | null;
  loading: boolean;
  hackathonId?: string;
}

export default function KanbanBoard({
  board: initialBoard,
  team,
  loading,
  hackathonId,
}: KanbanBoardProps) {
  const { user } = useAuth();
  const [board, setBoard] = useState<Board | undefined>(initialBoard);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isEditBoardModalOpen, setEditBoardModalOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [newListName, setNewListName] = useState("");
  const [isAddListModalOpen, setAddListModalOpen] = useState(false);
  const [isAddLabelModalOpen, setAddLabelModalOpen] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3B82F6"); // Default blue color
  const [editingLabel, setEditingLabel] = useState<BoardLabel | null>(null);

  // Local drag state
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  // Update local state when props change
  useEffect(() => {
    if (initialBoard) {
      setBoard(initialBoard);
      setBoardName(initialBoard.name);
      setBoardDescription(initialBoard.description || "");
    }
  }, [initialBoard]);

  // Check if current user is board owner
  const isOwner = user?.id === board?.owner?.id;

  // Debounced API calls for position updates
  const debouncedUpdateListPositions = useCallback(
    debounce((lists: BoardList[]) => {
      console.log("Updating list positions:", lists);
      // Simulate API call to update multiple list positions
      lists.forEach((list) => {
        updateBoardList(list);
      });
    }, 3000),
    []
  );

  const debouncedUpdateTaskPositions = useCallback(
    debounce((tasks: Task[]) => {
      console.log("Updating task positions:", tasks);
      // Simulate API call to update multiple task positions
      tasks.forEach((task) => {
        updateTask(task);
      });
    }, 3000),
    []
  );

  // API simulation functions
  const updateBoard = async (updatedBoard: Partial<Board>) => {
    try {
      console.log("Updating board:", updatedBoard);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              name: updatedBoard.name || prev.name,
              description: updatedBoard.description || prev.description,
              updatedAt: new Date().toISOString(),
            }
          : undefined
      );

      return true;
    } catch (error) {
      console.error("Error updating board:", error);
      return false;
    }
  };

  const createBoardList = async (name: string) => {
    try {
      console.log("Creating board list:", name);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const position = board?.boardLists?.length || 0;
      const newList: BoardList = {
        id: `list-${Date.now()}`,
        name,
        position,
        boardId: board?.id,
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdByUserName: user?.username,
      };

      // Update local state
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              boardLists: [...(prev.boardLists || []), newList],
              updatedAt: new Date().toISOString(),
            }
          : undefined
      );

      return newList;
    } catch (error) {
      console.error("Error creating board list:", error);
      return null;
    }
  };

  const updateBoardList = async (
    updatedList: Partial<BoardList> & { id: string }
  ) => {
    try {
      console.log("Updating board list:", updatedList);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setBoard((prev) => {
        if (!prev) return undefined;

        const updatedLists =
          prev.boardLists?.map((list) =>
            list.id === updatedList.id
              ? {
                  ...list,
                  name:
                    updatedList.name !== undefined
                      ? updatedList.name
                      : list.name,
                  position:
                    updatedList.position !== undefined
                      ? updatedList.position
                      : list.position,
                  updatedAt: new Date().toISOString(),
                }
              : list
          ) || [];

        return {
          ...prev,
          boardLists: updatedLists,
          updatedAt: new Date().toISOString(),
        };
      });

      return true;
    } catch (error) {
      console.error("Error updating board list:", error);
      return false;
    }
  };

  const deleteBoardList = async (listId: string) => {
    try {
      console.log("Deleting board list:", listId);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setBoard((prev) => {
        if (!prev) return undefined;

        // Get remaining lists
        const remainingLists =
          prev.boardLists?.filter((list) => list.id !== listId) || [];

        // Update positions of remaining lists
        const updatedLists = remainingLists.map((list, index) => ({
          ...list,
          position: index,
          updatedAt: new Date().toISOString(),
        }));

        return {
          ...prev,
          boardLists: updatedLists,
          updatedAt: new Date().toISOString(),
        };
      });

      return true;
    } catch (error) {
      console.error("Error deleting board list:", error);
      return false;
    }
  };

  const createBoardLabel = async (name: string, color: string) => {
    try {
      console.log("Creating board label:", { name, color });
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newLabel: BoardLabel = {
        id: `label-${Date.now()}`,
        name,
        color,
        boardId: board?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update local state
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              boardLabels: [...(prev.boardLabels || []), newLabel],
              updatedAt: new Date().toISOString(),
            }
          : undefined
      );

      return newLabel;
    } catch (error) {
      console.error("Error creating board label:", error);
      return null;
    }
  };

  const updateBoardLabel = async (
    updatedLabel: Partial<BoardLabel> & { id: string }
  ) => {
    try {
      console.log("Updating board label:", updatedLabel);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setBoard((prev) => {
        if (!prev) return undefined;

        const updatedLabels =
          prev.boardLabels?.map((label) =>
            label.id === updatedLabel.id
              ? {
                  ...label,
                  name:
                    updatedLabel.name !== undefined
                      ? updatedLabel.name
                      : label.name,
                  color:
                    updatedLabel.color !== undefined
                      ? updatedLabel.color
                      : label.color,
                  updatedAt: new Date().toISOString(),
                }
              : label
          ) || [];

        return {
          ...prev,
          boardLabels: updatedLabels,
          updatedAt: new Date().toISOString(),
        };
      });

      return true;
    } catch (error) {
      console.error("Error updating board label:", error);
      return false;
    }
  };

  const deleteBoardLabel = async (labelId: string) => {
    try {
      console.log("Deleting board label:", labelId);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setBoard((prev) => {
        if (!prev) return undefined;

        return {
          ...prev,
          boardLabels:
            prev.boardLabels?.filter((label) => label.id !== labelId) || [],
          updatedAt: new Date().toISOString(),
        };
      });

      return true;
    } catch (error) {
      console.error("Error deleting board label:", error);
      return false;
    }
  };

  const createTask = async (
    title: string,
    description: string | undefined,
    boardListId: string,
    dueDate: string | undefined
  ) => {
    try {
      console.log("Creating task:", {
        title,
        description,
        boardListId,
        dueDate,
      });
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const boardList = board?.boardLists?.find(
        (list) => list.id === boardListId
      );
      const position = boardList?.tasks?.length || 0;

      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        description,
        position,
        boardListId,
        dueDate,
        fileUrls: [],
        assignees: [],
        comments: [],
        taskLabels: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdByUserName: user?.username,
      };

      // Update local state
      setBoard((prev) => {
        if (!prev) return undefined;

        const updatedLists =
          prev.boardLists?.map((list) => {
            if (list.id === boardListId) {
              return {
                ...list,
                tasks: [...(list.tasks || []), newTask],
              };
            }
            return list;
          }) || [];

        return {
          ...prev,
          boardLists: updatedLists,
          updatedAt: new Date().toISOString(),
        };
      });

      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      return null;
    }
  };

  const updateTask = async (updatedTask: Partial<Task> & { id: string }) => {
    try {
      console.log("Updating task:", updatedTask);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setBoard((prev) => {
        if (!prev) return undefined;

        const updatedLists =
          prev.boardLists?.map((list) => {
            // Check if the task is in this list
            const taskIndex =
              list.tasks?.findIndex((task) => task.id === updatedTask.id) ?? -1;

            // If task doesn't exist in this list and there's no specified boardListId, skip this list
            if (taskIndex === -1 && updatedTask.boardListId !== list.id) {
              return list;
            }

            // If task exists in this list but needs to move to another list, remove it
            if (
              taskIndex !== -1 &&
              updatedTask.boardListId &&
              updatedTask.boardListId !== list.id
            ) {
              return {
                ...list,
                tasks: list.tasks?.filter((task) => task.id !== updatedTask.id),
              };
            }

            // If task belongs to this list (either existing or moving in)
            if (taskIndex !== -1 || updatedTask.boardListId === list.id) {
              const existingTasks =
                list.tasks?.filter((task) => task.id !== updatedTask.id) || [];
              const updatedTaskWithTimestamp = {
                ...(taskIndex !== -1 ? list.tasks?.[taskIndex] : {}),
                ...updatedTask,
                updatedAt: new Date().toISOString(),
              } as Task;

              // If just updating properties (not position or list), preserve order
              if (
                taskIndex !== -1 &&
                (!updatedTask.position || taskIndex === updatedTask.position) &&
                (!updatedTask.boardListId ||
                  updatedTask.boardListId === list.id)
              ) {
                const updatedTasks = [...existingTasks];
                updatedTasks.splice(taskIndex, 0, updatedTaskWithTimestamp);
                return { ...list, tasks: updatedTasks };
              }

              // If updating position or moving between lists
              let updatedTasks = [...existingTasks];
              const targetPosition = updatedTask.position ?? 0;

              // Insert at specified position
              if (targetPosition >= updatedTasks.length) {
                updatedTasks.push(updatedTaskWithTimestamp);
              } else {
                updatedTasks.splice(
                  targetPosition,
                  0,
                  updatedTaskWithTimestamp
                );
              }

              // Update positions of all tasks
              updatedTasks = updatedTasks.map((task, index) => ({
                ...task,
                position: index,
              }));

              return { ...list, tasks: updatedTasks };
            }

            return list;
          }) || [];

        return {
          ...prev,
          boardLists: updatedLists,
          updatedAt: new Date().toISOString(),
        };
      });

      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      return false;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      console.log("Deleting task:", taskId);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setBoard((prev) => {
        if (!prev) return undefined;

        const updatedLists =
          prev.boardLists?.map((list) => {
            const taskIndex =
              list.tasks?.findIndex((task) => task.id === taskId) ?? -1;
            if (taskIndex === -1) return list;

            // Remove task and update positions
            const updatedTasks =
              list.tasks
                ?.filter((task) => task.id !== taskId)
                .map((task, index) => ({
                  ...task,
                  position: index,
                })) || [];

            return {
              ...list,
              tasks: updatedTasks,
            };
          }) || [];

        return {
          ...prev,
          boardLists: updatedLists,
          updatedAt: new Date().toISOString(),
        };
      });

      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  };

  const addBoardUser = async (userId: string, role: BoardUserRole) => {
    try {
      console.log("Adding board user:", { boardId: board?.id, userId, role });
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const teamMember = team?.teamMembers?.find(
        (member) => member.user?.id === userId
      );
      if (!teamMember) {
        throw new Error("User is not a team member");
      }

      const newBoardUser: BoardUser = {
        id: `bu-${Date.now()}`,
        boardId: board?.id,
        userId: userId,
        user: teamMember.user,
        role: role,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update local state
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              boardUsers: [...(prev.boardUsers || []), newBoardUser],
              updatedAt: new Date().toISOString(),
            }
          : undefined
      );

      return newBoardUser;
    } catch (error) {
      console.error("Error adding board user:", error);
      return null;
    }
  };

  const updateBoardUser = async (boardUserId: string, role: BoardUserRole) => {
    try {
      console.log("Updating board user:", { boardUserId, role });
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setBoard((prev) => {
        if (!prev) return undefined;

        const updatedBoardUsers =
          prev.boardUsers?.map((boardUser) =>
            boardUser.id === boardUserId
              ? {
                  ...boardUser,
                  role,
                  updatedAt: new Date().toISOString(),
                }
              : boardUser
          ) || [];

        return {
          ...prev,
          boardUsers: updatedBoardUsers,
          updatedAt: new Date().toISOString(),
        };
      });

      return true;
    } catch (error) {
      console.error("Error updating board user:", error);
      return false;
    }
  };

  const removeBoardUser = async (boardUserId: string) => {
    try {
      console.log("Removing board user:", {
        boardUserId,
        deletedById: user?.id,
      });
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setBoard((prev) => {
        if (!prev) return undefined;

        const updatedBoardUsers =
          prev.boardUsers?.map((boardUser) =>
            boardUser.id === boardUserId
              ? {
                  ...boardUser,
                  isDeleted: true,
                  deletedById: user?.id,
                  updatedAt: new Date().toISOString(),
                }
              : boardUser
          ) || [];

        return {
          ...prev,
          boardUsers: updatedBoardUsers,
          updatedAt: new Date().toISOString(),
        };
      });

      return true;
    } catch (error) {
      console.error("Error removing board user:", error);
      return false;
    }
  };

  // DnD handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    if (activeId.startsWith("task-")) {
      setActiveTaskId(activeId);
    } else if (activeId.startsWith("list-")) {
      setActiveColumnId(activeId);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Skip if hovering over the same item
    if (activeId === overId) return;

    // Handle task drag between columns
    if (activeId.startsWith("task-") && overId.startsWith("list-")) {
      setBoard((prev) => {
        if (!prev) return undefined;

        let activeTask: Task | undefined;
        let sourceListId: string | undefined;

        // Find the task and its source list
        prev.boardLists?.forEach((list) => {
          const taskIndex = list.tasks?.findIndex(
            (task) => task.id === activeId
          );
          if (taskIndex !== undefined && taskIndex >= 0) {
            activeTask = list.tasks?.[taskIndex];
            sourceListId = list.id;
          }
        });

        if (!activeTask || !sourceListId) return prev;

        // If task is already moving to the same list, do nothing
        if (sourceListId === overId) return prev;

        // Update the lists
        const updatedLists = prev.boardLists?.map((list) => {
          // Remove from source list
          if (list.id === sourceListId) {
            return {
              ...list,
              tasks: list.tasks
                ?.filter((task) => task.id !== activeId)
                .map((task, idx) => ({
                  ...task,
                  position: idx,
                })),
            };
          }

          // Add to target list
          if (list.id === overId) {
            return {
              ...list,
              tasks: [
                ...(list.tasks || []),
                {
                  ...activeTask!,
                  boardListId: overId,
                  position: list.tasks?.length || 0,
                },
              ],
            };
          }

          return list;
        });

        return {
          ...prev,
          boardLists: updatedLists,
        };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Handle column reordering
    if (activeId.startsWith("list-") && overId.startsWith("list-")) {
      setBoard((prev) => {
        if (!prev || !prev.boardLists) return prev;

        const oldIndex = prev.boardLists.findIndex(
          (list) => list.id === activeId
        );
        const newIndex = prev.boardLists.findIndex(
          (list) => list.id === overId
        );

        if (oldIndex < 0 || newIndex < 0) return prev;

        const updatedLists = arrayMove(prev.boardLists, oldIndex, newIndex).map(
          (list, index) => ({ ...list, position: index })
        );

        // Debounce API call
        debouncedUpdateListPositions(updatedLists);

        return {
          ...prev,
          boardLists: updatedLists,
        };
      });
    }

    // Handle task reordering within the same column
    if (activeId.startsWith("task-") && overId.startsWith("task-")) {
      setBoard((prev) => {
        if (!prev) return undefined;

        let updatedLists = [...(prev.boardLists || [])];
        let tasksToUpdate: Task[] = [];

        // Find which list contains the tasks
        updatedLists = updatedLists.map((list) => {
          const activeTaskIndex = list.tasks?.findIndex(
            (task) => task.id === activeId
          );
          const overTaskIndex = list.tasks?.findIndex(
            (task) => task.id === overId
          );

          // If both tasks are in this list
          if (
            activeTaskIndex !== undefined &&
            activeTaskIndex >= 0 &&
            overTaskIndex !== undefined &&
            overTaskIndex >= 0
          ) {
            const updatedTasks = arrayMove(
              list.tasks || [],
              activeTaskIndex,
              overTaskIndex
            ).map((task, index) => ({ ...task, position: index }));

            tasksToUpdate = updatedTasks;

            return {
              ...list,
              tasks: updatedTasks,
            };
          }

          return list;
        });

        // Debounce API call
        if (tasksToUpdate.length > 0) {
          debouncedUpdateTaskPositions(tasksToUpdate);
        }

        return {
          ...prev,
          boardLists: updatedLists,
        };
      });
    }

    // Reset active IDs
    setActiveTaskId(null);
    setActiveColumnId(null);
  };

  const handleSaveBoard = async () => {
    const success = await updateBoard({
      id: board?.id,
      name: boardName,
      description: boardDescription,
    });

    if (success) {
      setEditBoardModalOpen(false);
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim()) return;

    await createBoardList(newListName);
    setNewListName("");
    setAddListModalOpen(false);
  };

  const handleAddLabel = async () => {
    if (!newLabelName.trim()) return;

    if (editingLabel) {
      await updateBoardLabel({
        id: editingLabel.id,
        name: newLabelName,
        color: newLabelColor,
      });
    } else {
      await createBoardLabel(newLabelName, newLabelColor);
    }

    setNewLabelName("");
    setNewLabelColor("#3B82F6");
    setEditingLabel(null);
    setAddLabelModalOpen(false);
  };

  // Filter active board users (not deleted)
  const activeBoardUsers =
    board?.boardUsers?.filter((bu) => !bu.isDeleted) || [];

  // Get team members who are not yet board users
  const nonBoardUsers =
    team?.teamMembers?.filter(
      (member) =>
        !activeBoardUsers.some((bu) => bu.user?.id === member.user?.id)
    ) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (!board) {
    return (
      <div className="flex justify-center items-center h-64">
        No board found for this team.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{board.name}</h1>
          <p className="text-gray-500">
            {board.description || "No description"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Edit Board Button (visible to owner only) */}
          {isOwner && (
            <button
              onClick={() => setEditBoardModalOpen(true)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm"
            >
              Edit Board
            </button>
          )}

          {/* Board Labels Button */}
          <button
            onClick={() => setAddLabelModalOpen(true)}
            className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm"
          >
            Labels
          </button>

          {/* Avatars */}
          <div className="flex -space-x-2">
            {activeBoardUsers.slice(0, 3).map((boardUser) => (
              <img
                key={boardUser.id}
                src={
                  boardUser.user?.avatarUrl || "https://via.placeholder.com/40"
                }
                alt={`${boardUser.user?.firstName} ${boardUser.user?.lastName}`}
                className="w-8 h-8 rounded-full border-2 border-white"
                title={`${boardUser.user?.firstName} ${boardUser.user?.lastName} (${boardUser.role})`}
              />
            ))}
            {activeBoardUsers.length > 3 && (
              <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium border-2 border-white">
                +{activeBoardUsers.length - 3}
              </span>
            )}
          </div>

          {/* Invite Users Button */}
          {isOwner && (
            <button
              onClick={() => setInviteModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Invite
            </button>
          )}

          {/* Add List Button */}
          <button
            onClick={() => setAddListModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            Add List
          </button>
        </div>
      </div>

      {/* Main Kanban Board */}
      <DndContext
        sensors={useSensors(useSensor(PointerSensor))}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext
            items={(board.boardLists || []).map((list) => list.id)}
          >
            {(board.boardLists || []).map((list) => (
              <KanbanColumn
                key={list.id}
                list={list}
                boardLabels={board.boardLabels || []}
                boardUsers={board.boardUsers || []}
                onUpdateList={updateBoardList}
                onDeleteList={deleteBoardList}
                onCreateTask={createTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {/* Edit Board Modal */}
      <Transition appear show={isEditBoardModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setEditBoardModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Edit Board
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="boardName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Board Name
                      </label>
                      <input
                        type="text"
                        id="boardName"
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="boardDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="boardDescription"
                        value={boardDescription}
                        onChange={(e) => setBoardDescription(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setEditBoardModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      onClick={handleSaveBoard}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add List Modal */}
      <Transition appear show={isAddListModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setAddListModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add New List
                  </Dialog.Title>
                  <div className="mt-4">
                    <label
                      htmlFor="listName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      List Name
                    </label>
                    <input
                      type="text"
                      id="listName"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setAddListModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      onClick={handleAddList}
                    >
                      Add
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Label Manager Modal */}
      <Transition appear show={isAddLabelModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setAddLabelModalOpen(false);
            setEditingLabel(null);
            setNewLabelName("");
            setNewLabelColor("#3B82F6");
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {editingLabel ? "Edit Label" : "Add New Label"}
                  </Dialog.Title>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="labelName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Label Name
                      </label>
                      <input
                        type="text"
                        id="labelName"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="labelColor"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Color
                      </label>
                      <input
                        type="color"
                        id="labelColor"
                        value={newLabelColor}
                        onChange={(e) => setNewLabelColor(e.target.value)}
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    {/* Existing Labels List */}
                    {(board.boardLabels || []).length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Existing Labels
                        </h4>
                        <div className="space-y-2">
                          {(board.boardLabels || []).map((label) => (
                            <div
                              key={label.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-6 h-6 rounded mr-2"
                                  style={{ backgroundColor: label.color }}
                                />
                                <span>{label.name}</span>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingLabel(label);
                                    setNewLabelName(label.name);
                                    setNewLabelColor(label.color);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteBoardLabel(label.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setAddLabelModalOpen(false);
                        setEditingLabel(null);
                        setNewLabelName("");
                        setNewLabelColor("#3B82F6");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      onClick={handleAddLabel}
                    >
                      {editingLabel ? "Update" : "Add"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Invite Users Modal */}
      <Transition appear show={isInviteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setInviteModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Manage Board Members
                  </Dialog.Title>

                  <div className="mt-4 space-y-4">
                    {/* Current Board Members */}
                    {activeBoardUsers.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Current Members
                        </h4>
                        <div className="space-y-2">
                          {activeBoardUsers.map((boardUser) => (
                            <div
                              key={boardUser.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <img
                                  src={
                                    boardUser.user?.avatarUrl ||
                                    "https://via.placeholder.com/40"
                                  }
                                  alt={`${boardUser.user?.firstName} ${boardUser.user?.lastName}`}
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                                <span>
                                  {boardUser.user?.firstName}{" "}
                                  {boardUser.user?.lastName}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <select
                                  value={boardUser.role}
                                  onChange={(e) => {
                                    if (boardUser.user?.id !== user?.id) {
                                      updateBoardUser(
                                        boardUser.id,
                                        e.target.value as BoardUserRole
                                      );
                                    }
                                  }}
                                  disabled={boardUser.user?.id === user?.id}
                                  className="rounded-md border-gray-300 text-sm"
                                >
                                  <option value="MEMBER">Member</option>
                                  <option value="ADMIN">Admin</option>
                                </select>
                                {boardUser.user?.id !== user?.id && (
                                  <button
                                    onClick={() =>
                                      removeBoardUser(boardUser.id)
                                    }
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Team Members to Add */}
                    {nonBoardUsers.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Team Members to Add
                        </h4>
                        <div className="space-y-2">
                          {nonBoardUsers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <img
                                  src={
                                    member.user?.avatarUrl ||
                                    "https://via.placeholder.com/40"
                                  }
                                  alt={`${member.user?.firstName} ${member.user?.lastName}`}
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                                <span>
                                  {member.user?.firstName}{" "}
                                  {member.user?.lastName}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    if (member.user?.id) {
                                      addBoardUser(member.user.id, "MEMBER");
                                    }
                                  }}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs"
                                >
                                  Add as Member
                                </button>
                                <button
                                  onClick={() => {
                                    if (member.user?.id) {
                                      addBoardUser(member.user.id, "ADMIN");
                                    }
                                  }}
                                  className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded-md text-xs"
                                >
                                  Add as Admin
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {nonBoardUsers.length === 0 && (
                      <p className="text-gray-500 text-sm italic">
                        All team members are already in the board.
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setInviteModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
