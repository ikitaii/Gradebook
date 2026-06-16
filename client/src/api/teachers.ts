import api from "../api";

export const getTeachersRequest = async () => {
  const response = await api.get("/teachers");
  return response.data;
};

export const getTeacherMeRequest = async () => {
  const response = await api.get("/teachers/me");
  return response.data;
};
