import React, { createContext, useContext, useState } from "react";
import type { Grade } from "./grade.types";
import { gradeApi } from "./grade.api";

interface GradeContextType {
  grades: Grade[];
  isLoading: boolean;
  fetchGroupGrades: (groupId: string, courseId: string) => Promise<void>;
  fetchMyGrades: (courseId: string) => Promise<void>;
  saveGrade: (studentId: string, lessonId: string, value: number, comment?: string) => Promise<void>;
}

const GradeContext = createContext<GradeContextType | undefined>(undefined);

export const GradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchGroupGrades = async (groupId: string, courseId: string) => {
    setIsLoading(true);
    try {
      const response = await gradeApi.getGroupGrades(groupId, courseId);
      setGrades(response.data);
    } catch (error) {
      console.error("Failed to fetch group grades", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyGrades = async (courseId: string) => {
    setIsLoading(true);
    try {
      const response = await gradeApi.getMyGrades(courseId);
      setGrades(response.data);
    } catch (error) {
      console.error("Failed to fetch my grades", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGrade = async (studentId: string, lessonId: string, value: number, comment?: string) => {
    await gradeApi.setGrade({ studentId, lessonId, value, comment }); 
    setGrades((prev) => {
      const filtered = prev.filter(g => !(g.studentId === studentId && g.lessonId === lessonId));
      const newGrade: Grade = {
        id: Math.random().toString(),  
        studentId,
        lessonId,
        value,
        comment,
        createdAt: new Date().toISOString()
      };
      return [...filtered, newGrade];
    });
  };

  return (
    <GradeContext.Provider value={{ grades, isLoading, fetchGroupGrades, fetchMyGrades, saveGrade }}>
      {children}
    </GradeContext.Provider>
  );
};

export const useGrades = () => {
  const context = useContext(GradeContext);
  if (!context) throw new Error("useGrades must be used within GradeProvider");
  return context;
};
