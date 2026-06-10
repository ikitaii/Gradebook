import type { User } from "../auth/auth.types";


export type SubmissionStatus = "SUBMITTED" | "ACCEPTED" | "REJECTED";
 
export interface Homework {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  dueDate?: string;
}
 
export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  student?: User;  
  solutionText: string; 
  status: SubmissionStatus;
  teacherFeedback?: string;
  updatedAt: string;
}

export interface CreateHomeworkDto {
  lessonId: string;
  title: string;
  description: string;
}

export interface SubmitSolutionDto {
  homeworkId: string;
  solutionText: string;
}

export interface ReviewSubmissionDto {
  submissionId: string;
  status: SubmissionStatus;
  feedback: string;
}
