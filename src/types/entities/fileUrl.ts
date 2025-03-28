// src/types/entities/fileUrl.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Submission } from "./submission";
import { Message } from "./message";
import { Task } from "./task";
import { ScheduleEvent } from "./scheduleEvent";
import { SponsorshipHackathonDetail } from "./sponsorshipHackathonDetail";
import { Device } from "./device";
import { UserDevice } from "./userDevice";
import { UserDeviceTrack } from "./userDeviceTrack";

export type FileUrl = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  submission?: Submission;
  submissionId?: string;
  message?: Message;
  messageId?: string;
  task?: Task;
  taskId?: string;
  scheduleEvent?: ScheduleEvent;
  scheduleEventId?: string;
  sponsorshipHackathonDetail?: SponsorshipHackathonDetail;
  sponsorshipHackathonDetailId?: string;
  device?: Device;
  deviceId?: string;
  userDevice?: UserDevice;
  userDeviceId?: string;
  userDeviceTrack?: UserDeviceTrack;
  userDeviceTrackId?: string;
} & AuditCreatedBase;
