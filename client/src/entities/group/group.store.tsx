import React, { createContext, useContext, useState } from "react";
import type { Group } from "./group.types";
import { groupApi } from "./group.api";
import type { User } from "../auth/auth.types";

interface GroupContextType {
  groups: Group[];
  availableStudents: User[];
  isLoading: boolean;
  fetchGroups: () => Promise<void>;
  fetchAvailableStudents: () => Promise<void>;
  createNewGroup: (name: string) => Promise<void>;
  addStudentToGroup: (groupId: string, studentId: string) => Promise<void>;
  assignCourseToGroup: (groupId: string, courseId: string) => Promise<void>;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [availableStudents, setAvailableStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await groupApi.getAll();
      setGroups(response.data);
    } catch (error) {
      console.error("Failed to fetch groups", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const response = await groupApi.getAvailableStudents();
      setAvailableStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch available students", error);
    }
  };

  const createNewGroup = async (name: string) => {
    await groupApi.createGroup({ name });
    await fetchGroups();
  };

  const addStudentToGroup = async (groupId: string, studentId: string) => {
    await groupApi.enrollStudent({ groupId, studentId });
    await fetchGroups();
    await fetchAvailableStudents();
  };

  const assignCourseToGroup = async (groupId: string, courseId: string) => {
    await groupApi.assignCourse({ groupId, courseId });
    await fetchGroups();
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        availableStudents,
        isLoading,
        fetchGroups,
        fetchAvailableStudents,
        createNewGroup,
        addStudentToGroup,
        assignCourseToGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error("useGroups must be used within GroupProvider");
  return context;
};
