import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";
import { Hackathon } from "./hackathon";
import { Team } from "./team";

export type MentorTeam = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  mentor?: User;
  mentorId?: string;
  team?: Team;
  teamId?: string;
} & AuditCreatedBase;
