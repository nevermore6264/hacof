// src/mocks/forumThread.mock.ts
import { ForumThread } from "@/types/entities/forumThread";

export const mockForumThreads: ForumThread[] = [
  {
    id: "thread1",
    title: "Welcome to the Forum",
    isLocked: false,
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdByUserName: "AdminUser",
  },
  {
    id: "thread2",
    title: "How to Request Features",
    isLocked: false,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdByUserName: "AliceSmith",
  },
  {
    id: "thread3",
    title: "Report Bugs Here",
    isLocked: false,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdByUserName: "BobJohnson",
  },
  {
    id: "thread4",
    title: "Random Chat",
    isLocked: false,
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdByUserName: "CharlieBrown",
  },
];
