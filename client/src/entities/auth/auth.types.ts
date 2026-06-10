export interface User {
  id: number;

  fullName: string;

  login: string;

  role:
    | "ADMIN"
    | "TEACHER"
    | "STUDENT";
}