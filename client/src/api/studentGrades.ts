import api from ".";

export const getStudentGrades = async (studentId: number) => {
  try {
    const response = await api.get(`/student-grades/${studentId}/grades`);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
};