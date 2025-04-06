// src/mocks/forumCategory.mock.ts
import { ForumCategory } from "@/types/entities/forumCategory";

export const mockForumCategories: ForumCategory[] = [
  {
    id: "category1",
    name: "General Discussion",
    description: "Talk about anything related to our community.",
    section: "General",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "category2",
    name: "Feature Requests",
    description: "Suggest new features and improvements.",
    section: "Community Feedback",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "category3",
    name: "Bug Reports",
    description: "Report bugs and issues you encounter.",
    section: "Community Feedback",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "category4",
    name: "Off-Topic",
    description: "Discuss anything not related to the platform.",
    section: "General",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
