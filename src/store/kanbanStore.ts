// src/store/kanbanStore.ts
import { create } from "zustand";
import {
  updateBoard,
  createBoardList,
  updateBoardList,
  deleteBoardList,
  updateBoardListPositions,
  createBoardLabel,
  updateBoardLabel,
  deleteBoardLabel,
  createTask,
  updateTaskPositions,
} from "@/services/boardService";
import { Board } from "@/types/entities/board";
import { BoardLabel } from "@/types/entities/boardLabel";
import { BoardList } from "@/types/entities/boardList";

export type Task = {
  id: string;
  title: string;
  status: string;
  boardListId: string;
  description?: string;
  position: number;
  dueDate?: string;
  assignees?: any[];
  labels?: any[];
};

export type Column = {
  id: string;
  title: string;
  position: number; // Updated to number to match BoardList type
  tasks: Task[];
};

interface KanbanState {
  // Data
  board: Board | null;
  columns: Column[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;

  // Column operations
  setColumns: (columns: Column[]) => void;
  moveTask: (taskId: string, from: string, to: string) => void;
  reorderTasksInColumn: (
    columnId: string,
    taskId: string,
    newPosition: number
  ) => void;
  createTask: (
    listId: string,
    taskData: {
      title: string;
      description?: string;
      dueDate?: string;
    }
  ) => Promise<Task | null>;
  updateTask: (updatedTask: Task) => void;
  removeTask: (taskId: string) => void;

  // Board operations
  setBoard: (board: Board) => void;
  updateBoardDetails: (
    name: string,
    description: string
  ) => Promise<Board | null>;

  // BoardList operations
  createList: (name: string, position?: number) => Promise<Column | null>;
  updateList: (listId: string, name: string) => Promise<boolean>;
  deleteList: (listId: string) => Promise<boolean>;
  moveList: (listId: string, newPosition: number) => void;

  // BoardLabel operations
  createLabel: (name: string, color: string) => Promise<BoardLabel | null>;
  updateLabel: (
    labelId: string,
    name: string,
    color: string
  ) => Promise<BoardLabel | null>;
  deleteLabel: (labelId: string) => Promise<boolean>;

  // Drag and drop boardList position update
  boardListPositionUpdateTimer: NodeJS.Timeout | null;
  pendingPositionUpdates: { id: string; position: number }[];
  setPendingPositionUpdates: (
    updates: { id: string; position: number }[]
  ) => void;
  processPendingPositionUpdates: () => void;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  // Initial state - removed hardcoded sample data
  board: null,
  columns: [],
  isLoading: false,
  error: null,
  boardListPositionUpdateTimer: null,
  pendingPositionUpdates: [],

  // Set functions
  setBoard: (board) => set({ board }),
  setColumns: (columns) => set({ columns }),
  setPendingPositionUpdates: (updates) =>
    set({ pendingPositionUpdates: updates }),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),

  createTask: async (listId, taskData) => {
    const state = get();
    if (!state.board) return null;

    const column = state.columns.find((col) => col.id === listId);
    if (!column) return null;

    try {
      // Calculate the position based on existing tasks
      const position = column.tasks.length;

      // Mock API call - replace with actual API when available
      const newTask = await createTask({
        ...taskData,
        boardListId: listId,
        position,
      });

      // Create task object for UI
      const taskForUI: Task = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description || "",
        status: column.title.toLowerCase().replace(/\s+/g, "-"),
        dueDate: newTask.dueDate,
        position: newTask.position,
        assignees: [],
        labels: [],
      };

      // Update local state
      set({
        columns: state.columns.map((col) =>
          col.id === listId ? { ...col, tasks: [...col.tasks, taskForUI] } : col
        ),
        isLoading: false,
      });

      return taskForUI;
    } catch (error) {
      console.error("Failed to create task:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to create task",
      });
      return null;
    }
  },

  // Update a task with new information
  updateTask: (updatedTask) => {
    set((state) => {
      // Find which column contains this task
      const columnId = updatedTask.boardListId;
      if (!columnId) return state;

      // Update the columns with the updated task
      const updatedColumns = state.columns.map((column) => {
        // If this column contains the task
        if (column.id === columnId) {
          // Update the task in this column
          const updatedTasks = column.tasks.map((task) =>
            task.id === updatedTask.id
              ? {
                  ...task,
                  title: updatedTask.title,
                  description: updatedTask.description || "",
                  dueDate: updatedTask.dueDate,
                  // Keep other task properties that might not be in the updated task object
                  // but preserve all the new values from the updated task
                  ...updatedTask,
                  // Ensure status is maintained properly
                  status: column.title.toLowerCase().replace(/\s+/g, "-"),
                }
              : task
          );

          return {
            ...column,
            tasks: updatedTasks,
          };
        }
        return column;
      });

      return { columns: updatedColumns };
    });
  },

  // Remove a task from the store
  removeTask: (taskId) => {
    set((state) => {
      // Find which column contains this task
      const columnWithTask = state.columns.find((column) =>
        column.tasks.some((task) => task.id === taskId)
      );

      if (!columnWithTask) return state;

      // Update the columns, removing the task from the appropriate column
      const updatedColumns = state.columns.map((column) => {
        if (column.id === columnWithTask.id) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          };
        }
        return column;
      });

      return { columns: updatedColumns };
    });
  },

  // Task operations
  moveTask: (taskId, fromColumnId, toColumnId) => {
    set((state) => {
      const sourceColumn = state.columns.find((col) => col.id === fromColumnId);
      const targetColumn = state.columns.find((col) => col.id === toColumnId);

      if (!sourceColumn || !targetColumn) return state;

      const taskIndex = sourceColumn.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return state;

      const task = sourceColumn.tasks[taskIndex];

      // Remove task from source column
      const updatedSourceTasks = sourceColumn.tasks.filter(
        (t) => t.id !== taskId
      );

      // Add task to target column with updated status
      const updatedTask = {
        ...task,
        status: targetColumn.title.toLowerCase().replace(/\s+/g, "-"),
      };

      // Add task to the end of target column
      const targetPosition = targetColumn.tasks.length;

      // Prepare updates for API call
      const updates = [
        {
          id: taskId,
          boardListId: toColumnId,
          position: targetPosition,
        },
      ];

      // Also need to update positions of tasks in source column
      updatedSourceTasks.forEach((task, index) => {
        if (task.position !== index) {
          updates.push({
            id: task.id,
            boardListId: fromColumnId,
            position: index,
          });
        }
      });

      // Call API to update task positions
      updateTaskPositions(updates).catch((error) => {
        console.error("Failed to update task positions:", error);
        // Could handle error state here
      });

      // Create new columns array
      const updatedColumns = state.columns.map((col) => {
        if (col.id === fromColumnId) {
          return {
            ...col,
            tasks: updatedSourceTasks.map((t, idx) => ({
              ...t,
              position: idx,
            })),
          };
        }
        if (col.id === toColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, { ...updatedTask, position: targetPosition }],
          };
        }
        return col;
      });

      return { columns: updatedColumns };
    });
  },

  // Board operations
  updateBoardDetails: async (name, description) => {
    const state = get();
    if (!state.board) return null;

    set({ isLoading: true, error: null });

    try {
      const updatedBoard = await updateBoard(state.board.id, {
        name,
        description,
      });
      set({
        board: { ...state.board, ...updatedBoard },
        isLoading: false,
      });
      return updatedBoard;
    } catch (error) {
      console.error("Failed to update board:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to update board",
      });
      return null;
    }
  },

  // BoardList operations
  createList: async (name, position) => {
    const state = get();
    if (!state.board) return null;

    set({ isLoading: true, error: null });

    try {
      // Use provided position or calculate it as the length of current columns
      const listPosition =
        position !== undefined ? position : state.columns.length;

      const newBoardList = await createBoardList({
        name,
        boardId: state.board.id,
        position: listPosition,
      });

      // Add to local state
      const newColumn: Column = {
        id: newBoardList.id,
        title: newBoardList.name,
        position: newBoardList.position,
        tasks: [],
      };

      set({
        columns: [...state.columns, newColumn],
        isLoading: false,
      });
      return newColumn;
    } catch (error) {
      console.error("Failed to create list:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to create list",
      });
      return null;
    }
  },

  updateList: async (listId, name) => {
    const state = get();
    if (!state.board) return false;

    set({ isLoading: true, error: null });

    try {
      const columnToUpdate = state.columns.find((col) => col.id === listId);
      if (!columnToUpdate) {
        set({ isLoading: false });
        return false;
      }

      await updateBoardList(listId, {
        name,
        boardId: state.board.id,
      });

      // Update local state
      set({
        columns: state.columns.map((col) =>
          col.id === listId ? { ...col, title: name } : col
        ),
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Failed to update list:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to update list",
      });
      return false;
    }
  },

  deleteList: async (listId) => {
    const state = get();
    set({ isLoading: true, error: null });

    try {
      await deleteBoardList(listId);

      // Update local state
      set({
        columns: state.columns.filter((col) => col.id !== listId),
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Failed to delete list:", error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to delete list",
      });
      return false;
    }
  },

  moveList: (listId, newPosition) => {
    const state = get();

    // Find the column being moved
    const columnIndex = state.columns.findIndex((col) => col.id === listId);
    if (columnIndex === -1 || columnIndex === newPosition) return;

    // Create a copy of columns
    const newColumns = [...state.columns];

    // Remove the column from its current position
    const [removed] = newColumns.splice(columnIndex, 1);

    // Insert the column at its new position
    newColumns.splice(newPosition, 0, removed);

    // Update columns in state with new positions
    const updatedColumns = newColumns.map((col, idx) => ({
      ...col,
      position: idx,
    }));

    // Update columns in state
    set({ columns: updatedColumns });

    // Prepare position updates for API
    const updates = updatedColumns.map((col) => ({
      id: col.id,
      position: col.position,
    }));

    // Update pending updates
    set({ pendingPositionUpdates: updates });

    // Handle debounced API call
    const { boardListPositionUpdateTimer } = get();
    if (boardListPositionUpdateTimer) {
      clearTimeout(boardListPositionUpdateTimer);
    }

    const newTimer = setTimeout(() => {
      get().processPendingPositionUpdates();
    }, 3000); // Changed from 30000 (30 seconds) to 3000 (3 seconds) for better user experience

    set({ boardListPositionUpdateTimer: newTimer });
  },

  processPendingPositionUpdates: async () => {
    const { pendingPositionUpdates } = get();
    if (pendingPositionUpdates.length === 0) return;

    set({ isLoading: true, error: null });

    try {
      await updateBoardListPositions(pendingPositionUpdates);
      set({
        pendingPositionUpdates: [],
        boardListPositionUpdateTimer: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to update board list positions:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update list positions",
        boardListPositionUpdateTimer: null,
      });
    }
  },

  // BoardLabel operations
  createLabel: async (name, color) => {
    const state = get();
    if (!state.board) return null;

    set({ isLoading: true, error: null });

    try {
      const newLabel = await createBoardLabel({
        name,
        color,
        boardId: state.board.id,
      });

      // Update local state if board.boardLabels exists
      if (state.board.boardLabels) {
        set({
          board: {
            ...state.board,
            boardLabels: [...state.board.boardLabels, newLabel],
          },
          isLoading: false,
        });
      } else {
        set({
          board: {
            ...state.board,
            boardLabels: [newLabel],
          },
          isLoading: false,
        });
      }

      return newLabel;
    } catch (error) {
      console.error("Failed to create label:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to create label",
      });
      return null;
    }
  },

  updateLabel: async (labelId, name, color) => {
    const state = get();
    if (!state.board) return null;

    set({ isLoading: true, error: null });

    try {
      const updatedLabel = await updateBoardLabel(labelId, {
        name,
        color,
        boardId: state.board.id,
      });

      // Update local state if boardLabels exists
      if (state.board.boardLabels) {
        set({
          board: {
            ...state.board,
            boardLabels: state.board.boardLabels.map((label) =>
              label.id === labelId ? { ...label, name, color } : label
            ),
          },
          isLoading: false,
        });
      }

      return updatedLabel;
    } catch (error) {
      console.error("Failed to update label:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to update label",
      });
      return null;
    }
  },

  deleteLabel: async (labelId) => {
    const state = get();
    if (!state.board || !state.board.boardLabels) return false;

    set({ isLoading: true, error: null });

    try {
      await deleteBoardLabel(labelId);

      // Update local state
      set({
        board: {
          ...state.board,
          boardLabels: state.board.boardLabels.filter(
            (label) => label.id !== labelId
          ),
        },
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error("Failed to delete label:", error);
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to delete label",
      });
      return false;
    }
  },

  reorderTasksInColumn: (
    columnId: string,
    taskId: string,
    newPosition: number
  ) => {
    set((state) => {
      const column = state.columns.find((col) => col.id === columnId);
      if (!column) return state;

      // Find the task and its current index
      const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return state;

      // Create a copy of tasks array
      const newTasks = [...column.tasks];

      // Remove the task from its current position
      const [removedTask] = newTasks.splice(taskIndex, 1);

      // Insert the task at the new position
      newTasks.splice(newPosition, 0, removedTask);

      // Update positions for all tasks in the column
      const updatedTasks = newTasks.map((task, index) => ({
        ...task,
        position: index, // Update position property for each task
      }));

      // Create updates for the API call
      const positionUpdates = updatedTasks.map((task) => ({
        id: task.id,
        boardListId: columnId,
        position: task.position,
      }));

      // Call API to update task positions
      updateTaskPositions(positionUpdates)
        .then((success) => {
          if (!success) {
            console.error("Failed to persist task position changes");
            // Optionally handle failure case (revert UI, show error, etc.)
          }
        })
        .catch((error) => {
          console.error("Error updating task positions:", error);
        });

      // Update the columns with the new task order
      const updatedColumns = state.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: updatedTasks } : col
      );

      return { columns: updatedColumns };
    });
  },
}));
