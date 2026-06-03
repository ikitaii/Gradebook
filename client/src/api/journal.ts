import api from ".";

export const getJournalRequest =
  async (groupId: number) => {
    const response = await api.get(
      `/groups/${groupId}/journal`
    );

    return response.data;
  };