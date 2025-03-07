// src/mocks/forumSubcategory.mock.ts
import { ForumSubcategory } from "@/types/entities/ForumSubcategory";
export const mockForumSubcategories: ForumSubcategory[] = [
  {
    id: "101",
    name: "Official Announcements",
    description: "Updates from organizers.",
    categoryId: "1",
  },
  {
    id: "102",
    name: "Judges' Feedback",
    description: "Feedback from judges.",
    categoryId: "1",
  },
  {
    id: "201",
    name: "Looking for Team",
    description: "Find teammates.",
    categoryId: "2",
  },
];
