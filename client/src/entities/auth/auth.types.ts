export type UserRole = "TEACHER" | "STUDENT";

export interface User {
  id: string;
  login: string; 
  role: UserRole;
  fullName: string;
}
