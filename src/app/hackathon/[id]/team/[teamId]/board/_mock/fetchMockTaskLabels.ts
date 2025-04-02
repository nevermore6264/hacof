// src/app/hackathon/[id]/team/[teamId]/board/_mock/fetchMockTaskLabels.ts
import { TaskLabel } from "@/types/entities/taskLabel";

export const fetchMockTaskLabelsByTaskId = (
  taskId: string
): Promise<TaskLabel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTaskLabels: TaskLabel[] = [
        {
          id: "taskLabel1",
          taskId,
          boardLabel: {
            id: "label1",
            name: "High Priority",
            color: "#FF0000",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          boardLabelId: "label1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "taskLabel2",
          taskId,
          boardLabel: {
            id: "label2",
            name: "Bug",
            color: "#FFAA00",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          boardLabelId: "label2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTaskLabels);
    }, 500);
  });
};
