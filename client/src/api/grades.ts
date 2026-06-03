import api from ".";

export const updateGradeRequest =
  async (
    studentId: number,
    lessonId: number,
    value: number
  ) => {
    const response = await api.post(
      "/grades",
      {
        studentId,
        lessonId,
        value,
      }
    );

    return response.data;
  };