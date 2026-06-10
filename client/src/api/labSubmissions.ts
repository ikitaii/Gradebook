import api from ".";

export const getLabSubmissionsRequest =
  async () => {
    const response =
      await api.get(
        "/lab-submissions"
      );

    return response.data;
  };

export const reviewLabRequest =
  async (
    submissionId: number,
    grade: number,
    comment: string
  ) => {
    const response =
      await api.patch(
        `/lab-submissions/${submissionId}`,
        {
          grade,
          comment,
        }
      );

    return response.data;
  };