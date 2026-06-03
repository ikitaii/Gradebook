import type { User } from "../auth/auth.types";    
import type { Course } from "../course/course.types"; 

export interface Group {
  id: string;
  name: string; 
  students: User[]; 
  courses: Course[]; 
}

export interface CreateGroupDto {
  name: string;
}

export interface EnrollStudentDto {
  groupId: string;
  studentId: string;
}

export interface AssignCourseDto {
  groupId: string;
  courseId: string;
}
