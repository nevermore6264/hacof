// src/types/entities/conversation.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Team } from "./team";
import { ConversationUser } from "./conversationUser";
import { Message } from "./message";
import { Hackathon } from "./hackathon";

export type ConversationType = "PRIVATE" | "PUBLIC";

export type Conversation = {
  id: string;
  team?: Team;
  teamId?: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  type: ConversationType;
  name?: string;
  conversationUsers?: ConversationUser[];
  messages?: Message[];
} & AuditCreatedBase;
