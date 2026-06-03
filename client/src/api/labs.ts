import api from ".";

export const getLabsRequest =
  async () => {
    const response =
      await api.get("/labs");

    return response.data;
  };

export const uploadLabRequest =
  async (
    labId: number,
    file: File
  ) => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "labId",
      String(labId)
    );

    const response =
      await api.post(
        "/labs/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };

export const checkLabRequest =
  async (
    submissionId: number,
    grade: number,
    comment: string
  ) => {
    const response =
      await api.patch(
        `/labs/check/${submissionId}`,
        {
          grade,
          comment,
        }
      );

    return response.data;
  };