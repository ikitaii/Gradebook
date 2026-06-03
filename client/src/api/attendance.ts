import api from ".";

export const updateAttendanceRequest =
  async (
    studentId: number,
    lessonId: number,
    present: boolean
  ) => {
    const response = await api.post(
      "/attendance",
      {
        studentId,
        lessonId,
        present,
      }
    );

    return response.data;
  };