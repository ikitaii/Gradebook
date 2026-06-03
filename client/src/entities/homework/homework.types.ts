import type { User } from "../auth/auth.types";


export type SubmissionStatus = "SUBMITTED" | "ACCEPTED" | "REJECTED";

// Само задание, которое создал учитель
export interface Homework {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  dueDate?: string;
}

// Ответ студента на это задание
export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  student?: User; // Здесь используется импортированный User
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
