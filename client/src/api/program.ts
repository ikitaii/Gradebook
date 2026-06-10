import api from ".";

export const getProgramRequest =
  async (
    subjectId: number
  ) => {
    const response =
      await api.get(
        `/program/${subjectId}`
      );

    return response.data;
  };

export const createProgramRequest =
  async (data: {
    subjectId: number;

    title: string;

    description: string;

    type: string;

    materialUrl: string;

    deadline: string;

    teamWork: boolean;
  }) => {
    const response =
      await api.post(
        "/program",
        data
      );

    return response.data;
  };