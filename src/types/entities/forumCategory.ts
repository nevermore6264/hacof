// Forum Category
import { PostSummary } from "./postSummary";
export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  threadsCount: number;
  messagesCount: number;
  lastPost?: PostSummary;
}
