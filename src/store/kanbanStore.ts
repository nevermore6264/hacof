// src/store/kanbanStore.ts
import { create } from "zustand";

export type Task = {
  id: string;
  title: string;
  status: string;
  description?: string;
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
  columns: Column[];
  setColumns: (columns: Column[]) => void;
  moveTask: (taskId: string, from: string, to: string) => void;
}

export const useKanbanStore = create<KanbanState>((set) => ({
  columns: [
    {
      id: "todo",
      title: "To Do",
      tasks: [{ id: "1", title: "Sample Task", status: "todo" }],
    },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ],

  setColumns: (columns) => {
    set({ columns });
  },

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
}));
