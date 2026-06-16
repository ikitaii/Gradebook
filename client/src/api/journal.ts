import api from ".";

export const getJournalAssignmentsRequest = async () => {
  const response = await api.get("/journal/assignments");
  return response.data;
};

export const getJournalRequest = async (groupId?: string, subjectId?: string) => {
  const response = await api.get("/journal", {
    params: { groupId, subjectId },
  });
  return response.data;
};

export const addJournalLessonRequest = async (data: {
  groupId: number;
  subjectId: number;
  date?: string;
}) => {
  const response = await api.post("/journal/lesson", data);
  return response.data;
};

export const setGradeRequest = async (
  studentId: number,
  lessonId: number,
  value: number
) => {
  const response = await api.post("/journal/grade", {
    studentId,
    lessonId,
    value,
  });
  return response.data;
};

export const setAttendanceRequest = async (
  studentId: number,
  lessonId: number,
  status: "LATE" | "ABSENT"
) => {
  const response = await api.post("/journal/attendance", {
    studentId,
    lessonId,
    status,
  });
  return response.data;
};
