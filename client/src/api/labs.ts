import api from ".";

export type LabListItem = {
  id: number;
  title: string;
  description: string;
  deadline: string;
  issuedAt: string | null;
  materialUrl: string | null;
  subject: string;
  subjectId?: number;
  groupId?: number | null;
  groupName?: string | null;
};

export const getLabByIdRequest = async (id: number) => {
  const response = await api.get(`/labs/${id}`);
  return response.data;
};

export const getLabsRequest = async () => {
  const response = await api.get("/labs");
  return response.data as LabListItem[];
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

export const getLabTeamCandidatesRequest = async (labId: number) => {
  const response = await api.get(`/labs/${labId}/team-candidates`);
  return response.data as {
    groupId: number;
    groupName: string;
    students: Array<{
      id: number;
      fullName: string;
      expelled: boolean;
      isNew: boolean;
    }>;
    team: { id: number; name: string; studentIds: number[] } | null;
  };
};

export const upsertLabTeamRequest = async (
  labId: number,
  payload: { name: string; studentIds: number[] }
) => {
  const response = await api.put(`/labs/${labId}/team`, payload);
  return response.data;
};
