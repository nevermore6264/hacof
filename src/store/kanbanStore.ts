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
} from "@/services/boardService";
import { Board } from "@/types/entities/board";
import { BoardLabel } from "@/types/entities/boardLabel";
import { BoardList } from "@/types/entities/boardList";

export type Task = {
  id: string;
  title: string;
  status: string;
  description?: string;
  position: number;
  dueDate?: string;
  assignees?: any[];
  labels?: any[];
};

export type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

interface KanbanState {
  // Data
  board: Board | null;
  columns: Column[];

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
  // Initial state
  board: null,
  columns: [
    {
      id: "todo",
      title: "To Do",
      tasks: [{ id: "1", title: "Sample Task", status: "todo" }],
    },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ],
  boardListPositionUpdateTimer: null,
  pendingPositionUpdates: [],

  // Set functions
  setBoard: (board) => set({ board }),
  setColumns: (columns) => set({ columns }),
  setPendingPositionUpdates: (updates) =>
    set({ pendingPositionUpdates: updates }),

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

      // Simulate the basic task object that would be returned from the API
      const taskForUI: Task = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description || "",
        status: column.title.toLowerCase().replace(/\s+/g, "-"),
        dueDate: newTask.dueDate,
        assignees: [],
        labels: [],
      };

      // Update local state
      set({
        columns: state.columns.map((col) =>
          col.id === listId ? { ...col, tasks: [...col.tasks, taskForUI] } : col
        ),
      });

      return taskForUI;
    } catch (error) {
      console.error("Failed to create task:", error);
      return null;
    }
  },

  // Task operations
  moveTask: (taskId, fromColumnId, toColumnId) => {
    set((state) => {
      const sourceColumn = state.columns.find((col) => col.id === fromColumnId);
      const targetColumn = state.columns.find((col) => col.id === toColumnId);

      if (!sourceColumn || !targetColumn) return state;

      const task = sourceColumn.tasks.find((t) => t.id === taskId);
      if (!task) return state;

      // Create a simulation of the API call that would happen
      console.log("API call: Moving task", {
        taskId,
        sourceBoardListId: fromColumnId,
        targetBoardListId: toColumnId,
      });

      // Remove task from source column
      const updatedSourceTasks = sourceColumn.tasks.filter(
        (t) => t.id !== taskId
      );

      // Add task to target column with updated status
      const updatedTask = {
        ...task,
        status: targetColumn.title.toLowerCase().replace(/\s+/g, "-"),
      };

      // Create new columns array
      const updatedColumns = state.columns.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, tasks: updatedSourceTasks };
        }
        if (col.id === toColumnId) {
          return { ...col, tasks: [...col.tasks, updatedTask] };
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

    try {
      const updatedBoard = await updateBoard(state.board.id, {
        name,
        description,
      });
      set({ board: { ...state.board, ...updatedBoard } });
      return updatedBoard;
    } catch (error) {
      console.error("Failed to update board:", error);
      return null;
    }
  },

  // BoardList operations
  createList: async (name) => {
    const state = get();
    if (!state.board) return null;

    try {
      // Calculate position as the length of current columns
      const position = state.columns.length;

      const newBoardList = await createBoardList({
        name,
        boardId: state.board.id,
        position,
      });

      // Add to local state
      const newColumn: Column = {
        id: newBoardList.id,
        title: newBoardList.name,
        tasks: [],
      };

      set({ columns: [...state.columns, newColumn] });
      return newColumn;
    } catch (error) {
      console.error("Failed to create list:", error);
      return null;
    }
  },

  updateList: async (listId, name) => {
    const state = get();
    if (!state.board) return false;

    try {
      const columnToUpdate = state.columns.find((col) => col.id === listId);
      if (!columnToUpdate) return false;

      await updateBoardList(listId, {
        name,
        boardId: state.board.id,
      });

      // Update local state
      set({
        columns: state.columns.map((col) =>
          col.id === listId ? { ...col, title: name } : col
        ),
      });

      return true;
    } catch (error) {
      console.error("Failed to update list:", error);
      return false;
    }
  },

  deleteList: async (listId) => {
    const state = get();

    try {
      await deleteBoardList(listId);

      // Update local state
      set({
        columns: state.columns.filter((col) => col.id !== listId),
      });

      return true;
    } catch (error) {
      console.error("Failed to delete list:", error);
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

    // Update columns in state
    set({ columns: newColumns });

    // Prepare position updates for API
    const updates = newColumns.map((col, index) => ({
      id: col.id,
      position: index,
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
    }, 3000);

    set({ boardListPositionUpdateTimer: newTimer });
  },

  processPendingPositionUpdates: async () => {
    const { pendingPositionUpdates } = get();
    if (pendingPositionUpdates.length === 0) return;

    try {
      await updateBoardListPositions(pendingPositionUpdates);
      set({
        pendingPositionUpdates: [],
        boardListPositionUpdateTimer: null,
      });
    } catch (error) {
      console.error("Failed to update board list positions:", error);
    }
  },

  // BoardLabel operations
  createLabel: async (name, color) => {
    const state = get();
    if (!state.board) return null;

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
        });
      }

      return newLabel;
    } catch (error) {
      console.error("Failed to create label:", error);
      return null;
    }
  },

  updateLabel: async (labelId, name, color) => {
    const state = get();
    if (!state.board || !state.board.boardLabels) return null;

    try {
      const updatedLabel = await updateBoardLabel(labelId, {
        name,
        color,
        boardId: state.board.id,
      });

      // Update local state
      set({
        board: {
          ...state.board,
          boardLabels: state.board.boardLabels.map((label) =>
            label.id === labelId ? { ...label, name, color } : label
          ),
        },
      });

      return updatedLabel;
    } catch (error) {
      console.error("Failed to update label:", error);
      return null;
    }
  },

  deleteLabel: async (labelId) => {
    const state = get();
    if (!state.board || !state.board.boardLabels) return false;

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
      });

      return true;
    } catch (error) {
      console.error("Failed to delete label:", error);
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

      // Create simulation of API call to update positions
      console.log("API call: Reordering tasks in column", {
        columnId,
        tasks: updatedTasks.map((task) => ({
          id: task.id,
          position: task.position,
        })),
      });

      // In a real app, you would call an API here to persist the position changes
      // For example: updateTaskPositions(columnId, updatedTasks.map(t => ({ id: t.id, position: t.position })));

      // Update the columns with the new task order
      const updatedColumns = state.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: updatedTasks } : col
      );

      return { columns: updatedColumns };
    });
  },
}));
