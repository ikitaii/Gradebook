import { api } from "../../shared/api/api";
import type { Grade, SetGradeDto } from "./grade.types";

export const gradeApi = {
  
  getGroupGrades: (groupId: string, courseId: string) => 
    api.get<Grade[]>(`/grades/group/${groupId}/course/${courseId}`),

  
  getMyGrades: (courseId: string) => 
    api.get<Grade[]>(`/grades/my/course/${courseId}`),

 
  setGrade: (data: SetGradeDto) => 
    api.post<Grade>("/grades", data),
};
