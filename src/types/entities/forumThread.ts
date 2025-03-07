import { User } from "./users";
import { PostSummary } from "./postSummary";
export interface ForumThread {
  id: string;
  title: string;
  categoryId: string;
  author: User;
  createdAt: string;
  repliesCount: number;
  viewsCount: number;
  lastPost: PostSummary;
  isPinned?: boolean;
  isLocked?: boolean;
}
