import React, { createContext, useContext, useState } from "react";
import type { Homework, HomeworkSubmission } from "./homework.types";
import { homeworkApi } from "./homework.api";

interface HomeworkContextType {
  currentHomework: Homework | null;
  submissions: HomeworkSubmission[];
  mySubmission: HomeworkSubmission | null;
  isLoading: boolean;
  fetchHomeworkByLesson: (lessonId: string) => Promise<void>;
  createHomework: (lessonId: string, title: string, description: string) => Promise<void>;
  fetchSubmissions: (homeworkId: string) => Promise<void>;
  fetchMySubmission: (homeworkId: string) => Promise<void>;
  sendSolution: (homeworkId: string, text: string) => Promise<void>;
  checkSubmission: (submissionId: string, status: "ACCEPTED" | "REJECTED", feedback: string) => Promise<void>;
}

const HomeworkContext = createContext<HomeworkContextType | undefined>(undefined);

export const HomeworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHomework, setCurrentHomework] = useState<Homework | null>(null);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
  const [mySubmission, setMySubmission] = useState<HomeworkSubmission | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchHomeworkByLesson = async (lessonId: string) => {
    setIsLoading(true);
    try {
      const response = await homeworkApi.getByLessonId(lessonId);
      setCurrentHomework(response.data);
    } catch {
      setCurrentHomework(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createHomework = async (lessonId: string, title: string, description: string) => {
    const response = await homeworkApi.create({ lessonId, title, description });
    setCurrentHomework(response.data);
  };

  const fetchSubmissions = async (homeworkId: string) => {
    const response = await homeworkApi.getSubmissions(homeworkId);
    setSubmissions(response.data);
  };

  const fetchMySubmission = async (homeworkId: string) => {
    const response = await homeworkApi.getMySubmission(homeworkId);
    setMySubmission(response.data);
  };

  const sendSolution = async (homeworkId: string, text: string) => {
    const response = await homeworkApi.submitSolution({ homeworkId, solutionText: text });
    setMySubmission(response.data);
  };

  const checkSubmission = async (submissionId: string, status: "ACCEPTED" | "REJECTED", feedback: string) => {
    const response = await homeworkApi.reviewSubmission({ submissionId, status, feedback });
    // Обновляем статус проверенной домашки локально в списке преподавателя
    setSubmissions(prev => prev.map(s => s.id === submissionId ? response.data : s));
  };

  return (
    <HomeworkContext.Provider value={{
      currentHomework, submissions, mySubmission, isLoading,
      fetchHomeworkByLesson, createHomework, fetchSubmissions, fetchMySubmission, sendSolution, checkSubmission
    }}>
      {children}
    </HomeworkContext.Provider>
  );
};

export const useHomework = () => {
  const context = useContext(HomeworkContext);
  if (!context) throw new Error("useHomework must be used within HomeworkProvider");
  return context;
};
