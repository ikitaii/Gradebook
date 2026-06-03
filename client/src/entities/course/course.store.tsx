import React, { createContext, useContext, useState } from "react";
import type { Course } from "./course.types";
import { courseApi } from "./course.api";

interface CourseContextType {
  courses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  fetchCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  createNewCourse: (title: string, description: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await courseApi.getAll();
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourseById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await courseApi.getById(id);
      setCurrentCourse(response.data);
    } catch (error) {
      console.error("Failed to fetch course details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewCourse = async (title: string, description: string) => {
    try {
      await courseApi.createCourse({ title, description });
      await fetchCourses(); 
    } catch (error) {
      console.error("Failed to create course", error);
      throw error;
    }
  };

  return (
    <CourseContext.Provider value={{ courses, currentCourse, isLoading, fetchCourses, fetchCourseById, createNewCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error("useCourses must be used within CourseProvider");
  return context;
};
