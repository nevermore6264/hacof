// src/mocks/forumThread.mock.ts
import { ForumThread } from "@/types/entities/forumThread";

export const mockForumThreads: ForumThread[] = [
  {
    id: "thread1",
    title: "Welcome to the Forum",
    isLocked: false,
    isPinned: true,
    threadPosts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { id: "user1", firstName: "Admin", lastName: "User" },
  },
  {
    id: "thread2",
    title: "How to Request Features",
    isLocked: false,
    isPinned: false,
    threadPosts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { id: "user2", firstName: "Alice", lastName: "Smith" },
  },
  {
    id: "thread3",
    title: "Report Bugs Here",
    isLocked: false,
    isPinned: false,
    threadPosts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { id: "user3", firstName: "Bob", lastName: "Johnson" },
  },
  {
    id: "thread4",
    title: "Random Chat",
    isLocked: false,
    isPinned: false,
    threadPosts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { id: "user4", firstName: "Charlie", lastName: "Brown" },
  },
];
