import api from ".";

export const getLessonsRequest =
  async () => {
    const response =
      await api.get("/lessons");

    return response.data;
  };