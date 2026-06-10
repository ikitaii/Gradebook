import api from ".";

export const getSubjectsRequest =
  async () => {
    const response =
      await api.get(
        "/subjects"
      );

    return response.data;
  };

export const createSubjectRequest =
  async (name: string) => {
    const response = await api.post(
      "/subjects",
      {
        name,
      }
    );

    return response.data;
  };

export const deleteSubjectRequest =
  async (id: number) => {
    const response =
      await api.delete(
        `/subjects/${id}`
      );

    return response.data;
  };