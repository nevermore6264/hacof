// src/types/entities/userHackathon.ts
import { AuditBase } from "./auditBase";
import { User } from "./user";
import { Hackathon } from "./hackathon";

export type UserHackathon = {
  id: string;
  user?: User;
  userId?: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  role: string;
} & AuditBase;
