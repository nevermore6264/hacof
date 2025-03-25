// src/types/entities/mentorshipSessionRequest.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { User } from "./user";
import { Team } from "./team";

export type MentorshipSessionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "deleted"
  | "completed";

export type MentorshipSessionRequest = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  mentor?: User;
  mentorId?: string;
  team?: Team;
  teamId?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  status?: MentorshipSessionStatus;
  evaluatedBy?: User;
  evaluatedById?: string;
  evaluatedAt?: string;
} & AuditCreatedBase;
