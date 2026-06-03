import { api } from "../../shared/api/api";

export const authApi = {
 
  login: (data: { login: string; password: string }) =>
    api.post("/auth/login", data),

  me: () => api.get("/auth/me"),
};
