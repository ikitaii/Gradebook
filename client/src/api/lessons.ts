import api from ".";

export const getLessonsRequest =
  async () => {
    const response =
      await api.get(
        "/lessons"
      );

    return response.data;
  };

export const createLessonRequest =
  async (data: {
    date: string;

    groupId: number;

    subjectId: number;

    teacherId: number;
  }) => {
    const response =
      await api.post(
        "/lessons",
        data
      );

    return response.data;
  };

export const deleteLessonRequest =
  async (
    id: number
  ) => {
    const response =
      await api.delete(
        `/lessons/${id}`
      );

    return response.data;
  };