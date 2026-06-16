import api from "../api";

export type ScheduleItem = {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  group: { id: number; name: string };
  subject: { id: number; name: string };
  teacher: { id: number; user: { fullName: string } };
};

export const getScheduleRequest = async (): Promise<ScheduleItem[]> => {
  const response = await api.get("/schedule");
  return response.data;
};

export const createScheduleRequest = async (data: {
  groupId: number;
  subjectId: number;
  teacherId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room?: string;
}) => {
  const response = await api.post("/schedule", data);
  return response.data;
};

export const updateScheduleRequest = async (
  id: number,
  data: Partial<{
    groupId: number;
    subjectId: number;
    teacherId: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string;
  }>
) => {
  const response = await api.put(`/schedule/${id}`, data);
  return response.data;
};

export const deleteScheduleRequest = async (id: number) => {
  const response = await api.delete(`/schedule/${id}`);
  return response.data;
};
