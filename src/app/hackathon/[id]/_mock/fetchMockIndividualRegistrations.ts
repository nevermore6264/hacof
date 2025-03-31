// src/app/hackathon/[id]/_mock/fetchMockIndividualRegistrations.ts
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";

export const fetchMockIndividualRegistrations = (
  createdByUserName: string,
  hackathonId: string
): Promise<IndividualRegistrationRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockIndividualRegistrations: IndividualRegistrationRequest[] = [
        {
          id: "reg1",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          status: "PENDING",
          reviewedBy: undefined,
          createdByUserName: createdByUserName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg2",
          hackathon: { id: hackathonId, title: "Hackathon X" },
          status: "APPROVED",
          reviewedBy: { id: "adminUser", firstName: "Admin", lastName: "User" },
          createdByUserName: createdByUserName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockIndividualRegistrations);
    }, 500);
  });
};
