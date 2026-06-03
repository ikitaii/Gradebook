import { api } from "../../shared/api/api";
import type { Course, CreateCourseDto, CreateModuleDto, CreateLessonDto } from "./course.types";

export const courseApi = {
  
  getAll: () => api.get<Course[]>("/courses"),

  getById: (id: string) => api.get<Course>(`/courses/${id}`),

  
  createCourse: (data: CreateCourseDto) => api.post<Course>("/courses", data),

  
  createModule: (data: CreateModuleDto) => api.post(`/modules`, data),

 
  createLesson: (data: CreateLessonDto) => api.post(`/lessons`, data),
};
