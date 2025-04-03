import { Task } from "@/types/entities/task";

export const fetchMockTasksByTaskId = (taskId: string): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTasks: Task[] = [
        {
          id: taskId,
          title: "Set up project repository",
          description: "Initialize Git repository and configure CI/CD",
          position: 0,
          boardListId: "board1",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          fileUrls: [
            {
              id: "file1",
              fileName: "setup-instructions.pdf",
              fileUrl: "https://example.com/files/setup-instructions.pdf",
              fileType: "application/pdf",
              fileSize: 2048000,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdByUserName: "johnsmith",
            },
          ],
          assignees: [
            {
              id: "assign1",
              user: {
                id: "user123",
                firstName: "John",
                lastName: "Smith",
                email: "john.smith@example.com",
                username: "johnsmith",
                avatarUrl: "https://example.com/john-avatar.png",
                status: "Active",
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          comments: [
            {
              id: "comment1",
              content: "I'll start on this tomorrow morning",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdByUserName: "johnsmith",
            },
          ],
          taskLabels: [
            {
              id: "taskLabel1",
              boardLabel: {
                id: "label1",
                name: "High Priority",
                color: "#FF0000",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "johnsmith",
        },
      ];
      resolve(mockTasks);
    }, 500);
  });
};
