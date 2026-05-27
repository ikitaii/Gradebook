import api from ".";

export const getGroupsRequest =
  async () => {
    const response = await api.get(
      "/groups"
    );

    return response.data;
  };