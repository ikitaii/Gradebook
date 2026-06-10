import { api } from "../../shared/api/api";
import type { 
  Homework, HomeworkSubmission, 
  CreateHomeworkDto, SubmitSolutionDto, ReviewSubmissionDto 
} from "./homework.types";

export const homeworkApi = { 
  getByLessonId: (lessonId: string) => 
    api.get<Homework | null>(`/homework/lesson/${lessonId}`),
 
  create: (data: CreateHomeworkDto) => 
    api.post<Homework>("/homework", data),
 
  submitSolution: (data: SubmitSolutionDto) => 
    api.post<HomeworkSubmission>("/homework/submissions", data),
 
  getSubmissions: (homeworkId: string) => 
    api.get<HomeworkSubmission[]>(`/homework/${homeworkId}/submissions`),
 
  getMySubmission: (homeworkId: string) => 
    api.get<HomeworkSubmission | null>(`/homework/${homeworkId}/my-submission`),
 
  reviewSubmission: (data: ReviewSubmissionDto) => 
    api.patch<HomeworkSubmission>("/homework/submissions/review", data),
};
