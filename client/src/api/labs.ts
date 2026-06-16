import api from ".";

export const getLabByIdRequest = async (id: number) => {
  const response = await api.get(`/labs/${id}`);
  return response.data;
};

export const getLabsRequest = async () => {
  const response = await api.get("/labs");
  return response.data;
};

export const getMySubmissionsRequest = async () => {
  const response = await api.get("/lab-submissions/my");
  return response.data;
};

export const uploadLabFileRequest = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/labs/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const submitLabRequest = async (labId: number, fileUrl: string) => {
  const response = await api.post("/lab-submissions", { labId, fileUrl });
  return response.data;
};

export const reviewLabSubmissionRequest = async (
  submissionId: number,
  grade: number,
  comment: string
) => {
  const response = await api.patch(`/lab-submissions/${submissionId}`, {
    grade,
    comment,
  });
  return response.data;
};
