// src/types/entities/board.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";
import { Team } from "./team";
import { BoardUser } from "./boardUser";
import { BoardList } from "./boardList";
import { BoardLabel } from "./boardLabel";
import { Hackathon } from "./hackathon";

export type Board = {
  id: string;
  name: string;
  description?: string;
  owner?: User;
  ownerId?: string;
  team?: Team;
  teamId?: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  boardUsers?: BoardUser[];
  boardLists?: BoardList[];
  boardLabels?: BoardLabel[];
} & AuditCreatedBase;
