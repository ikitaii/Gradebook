import { api } from "../../shared/api/api";
import type { 
  Homework, HomeworkSubmission, 
  CreateHomeworkDto, SubmitSolutionDto, ReviewSubmissionDto 
} from "./homework.types";

export const homeworkApi = {
  // Получить задание по ID урока
  getByLessonId: (lessonId: string) => 
    api.get<Homework | null>(`/homework/lesson/${lessonId}`),

  // Создать задание (только TEACHER)
  create: (data: CreateHomeworkDto) => 
    api.post<Homework>("/homework", data),

  // Отправить решение (только STUDENT)
  submitSolution: (data: SubmitSolutionDto) => 
    api.post<HomeworkSubmission>("/homework/submissions", data),

  // Получить все ответы студентов на конкретное задание (для TEACHER)
  getSubmissions: (homeworkId: string) => 
    api.get<HomeworkSubmission[]>(`/homework/${homeworkId}/submissions`),

  // Получить СВОЙ ответ на задание (для STUDENT)
  getMySubmission: (homeworkId: string) => 
    api.get<HomeworkSubmission | null>(`/homework/${homeworkId}/my-submission`),

  // Проверить домашку: выставить статус и написать фидбек (только TEACHER)
  reviewSubmission: (data: ReviewSubmissionDto) => 
    api.patch<HomeworkSubmission>("/homework/submissions/review", data),
};
