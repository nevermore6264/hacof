// src/app/forum/thread/[id]/_mock/fetchMockThreadPosts.ts
import { ThreadPost } from "@/types/entities/threadPost";

export const fetchMockThreadPosts = (
  forumThreadId: string
): Promise<ThreadPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockThreadPosts: ThreadPost[] = [
        {
          id: "post1",
          forumThread: { id: forumThreadId, title: "Discussion on Next.js" },
          content: "I love using Next.js for SSR and static generation!",
          isDeleted: false,
          deletedBy: undefined,
          threadPostLikes: [
            {
              id: "like1",
              threadPost: undefined,
              createdAt: new Date().toISOString(),
              createdBy: { id: "user2", firstName: "Bob", lastName: "Johnson" },
            },
            {
              id: "like2",
              threadPost: undefined,
              createdAt: new Date().toISOString(),
              createdBy: {
                id: "user3",
                firstName: "Charlie",
                lastName: "Brown",
              },
            },
          ],
          threadPostReports: [
            {
              id: "report1",
              threadPost: undefined,
              reason: "Inappropriate content",
              status: "PENDING",
              createdAt: new Date().toISOString(),
              createdBy: {
                id: "user4",
                firstName: "David",
                lastName: "Miller",
              },
            },
          ],
          createdAt: new Date().toISOString(),
          createdBy: { id: "user1", firstName: "Alice", lastName: "Smith" },
        },
        {
          id: "post2",
          forumThread: { id: forumThreadId, title: "Discussion on Next.js" },
          content: "TypeScript makes it even better!",
          isDeleted: false,
          deletedBy: undefined,
          threadPostLikes: [
            {
              id: "like3",
              threadPost: undefined,
              createdAt: new Date().toISOString(),
              createdBy: { id: "user1", firstName: "Alice", lastName: "Smith" },
            },
          ],
          threadPostReports: [],
          createdAt: new Date().toISOString(),
          createdBy: { id: "user2", firstName: "Bob", lastName: "Johnson" },
        },
        {
          id: "post3",
          forumThread: { id: forumThreadId, title: "Discussion on Next.js" },
          content: "Tailwind CSS integration is smooth and powerful.",
          isDeleted: true,
          deletedBy: { id: "admin1", firstName: "Admin", lastName: "User" },
          threadPostLikes: [],
          threadPostReports: [
            {
              id: "report2",
              threadPost: undefined,
              reason: "Spam",
              status: "REVIEWED",
              createdAt: new Date().toISOString(),
              createdBy: { id: "user5", firstName: "Emily", lastName: "Davis" },
              reviewedBy: {
                id: "admin1",
                firstName: "Admin",
                lastName: "User",
              },
            },
          ],
          createdAt: new Date().toISOString(),
          createdBy: { id: "user3", firstName: "Charlie", lastName: "Brown" },
        },
      ];
      resolve(mockThreadPosts);
    }, 500);
  });
};
