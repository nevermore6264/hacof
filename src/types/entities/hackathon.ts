// src\types\entities\hackathon.ts

export type Hackathon = {
  id: string;
  title: string;
  subtitle: string;
  bannerImageUrl: string;
  enrollStartDate: string;
  enrollEndDate: string;
  enrollmentCount: number;
  startDate: string;
  endDate: string;
  information: string;
  description: string;
  participant: string;
  documentation: string[]; // document public URLs
  contact: string;
};
