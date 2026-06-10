import api from ".";

export const getDashboardRequest =
  async () => {
    const response =
      await api.get(
        "/dashboard"
      );

    return response.data;
  };