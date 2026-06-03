import { api } from "../../shared/api/api";
import type { Group, CreateGroupDto, EnrollStudentDto, AssignCourseDto } from "./group.types";
import type { User } from "../auth/auth.types"; 

export const groupApi = {
 
  getAll: () => api.get<Group[]>("/groups"),

  
  getById: (id: string) => api.get<Group>(`/groups/${id}`),

  
  createGroup: (data: CreateGroupDto) => api.post<Group>("/groups", data),

  
  enrollStudent: (data: EnrollStudentDto) => api.post(`/groups/enroll`, data),

  
  assignCourse: (data: AssignCourseDto) => api.post(`/groups/assign-course`, data),

  
  getAvailableStudents: () => api.get<User[]>("/users/students-without-group"),
};
