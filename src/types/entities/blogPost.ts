// src/types/entities/blogPost.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";

export enum BlogPostStatus {
  DRAFT = "DRAFT",
  PENDING_REVIEW = "PENDING_REVIEW",
  APPROVED = "APPROVED",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  bannerImageUrl: string;
  content: string;
  status: BlogPostStatus;
  reviewedBy?: User;
  reviewedById?: string;
  publishedAt?: string;
} & AuditCreatedBase;
