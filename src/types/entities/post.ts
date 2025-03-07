import { User } from "./users";
export interface Post {
  id: string;
  threadId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Post[];
}
