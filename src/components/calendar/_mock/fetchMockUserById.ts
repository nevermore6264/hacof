// src/components/calendar/_mock/fetchMockUserById.ts
import { User } from "@/types/entities/user";

export const fetchMockUserById = (userId: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser: User = {
        id: userId,
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie@example.com",
        userRoles: [
          {
            id: "ur3",
            role: { id: "3", name: "ORGANIZER" },
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resolve(mockUser);
    }, 500);
  });
};
