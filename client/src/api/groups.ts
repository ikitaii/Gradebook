import api from ".";
export const createGroupRequest =
  async (name: string) => {
    const response = await api.post(
      "/groups",
      {
        name,
      }
    );

    return response.data;
  };

export const getGroupsRequest =
  async () => {
    const response =
      await api.get(
        "/groups"
      );

    return response.data;
  };
export const deleteGroupRequest =
  async (id: number) => {
    const response =
      await api.delete(
        `/groups/${id}`
      );

    return response.data;
  };