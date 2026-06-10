import { api } from "../../shared/api/api";

export const authApi = {
  login: (
    data: {
      login: string;
      password: string;
    }
  ) =>
    api.post(
      "/auth/login",
      data
    ),

  me: () => {
    console.log(
      "TOKEN:",
      localStorage.getItem(
        "token"
      )
    );

    return api.get("/auth/me");
  },
};