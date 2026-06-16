import api from ".";

export type Student = {
  id: number;
  expelled: boolean;
  isNew: boolean;
  user: { id: number; fullName: string; login: string };
  group: { id: number; name: string };
};

export const getStudentsRequest = async (): Promise<Student[]> => {
  const response = await api.get("/students");
  return response.data;
};

export const getMyStudentProfileRequest = async (): Promise<Student> => {
  const response = await api.get("/students/me");
  return response.data;
};

export const getMySubjectsRequest = async () => {
  const response = await api.get("/students/me/subjects");
  return response.data;
};

export const createStudentRequest = async (data: {
  fullName: string;
  login: string;
  password: string;
  groupId: number;
}) => {
  const response = await api.post("/students", {
    ...data,
    expelled: false,
    isNew: true,
  });
  return response.data;
};

export const updateStudentRequest = async (
  id: number,
  data: Partial<{
    fullName: string;
    login: string;
    groupId: number;
    expelled: boolean;
    isNew: boolean;
  }>
) => {
  const response = await api.patch(`/students/${id}`, data);
  return response.data;
};

export const deleteStudentRequest = async (id: number) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};
