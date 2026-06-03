export type UserRole = "TEACHER" | "STUDENT";

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
}