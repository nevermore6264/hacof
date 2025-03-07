import { User } from "./users";
// Summary of the last post in a category or thread
export interface PostSummary {
  threadId: string;
  threadTitle: string;
  postId: string;
  author: User;
  createdAt: string;
}
