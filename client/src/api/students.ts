import api from ".";

export const getStudentsRequest =
  async () => {
    const response = await api.get(
      "/students"
    );

    return response.data;
  };

export const createStudentRequest =
  async (
    userId: number,
    groupId: number
  ) => {
    const response = await api.post(
      "/students",
      {
        userId,
        groupId,
        expelled: false,
        isNew: true,
      }
    );

    return response.data;
  };

export const deleteStudentRequest =
  async (id: number) => {
    const response =
      await api.delete(
        `/students/${id}`
      );

    return response.data;
  };