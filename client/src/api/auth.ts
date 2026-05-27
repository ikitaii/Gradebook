import api from ".";

export const loginRequest = async (
  login: string,
  password: string
) => {
  const response = await api.post(
    "/auth/login",
    {
      login,
      password,
    }
  );

  return response.data;
};

export const registerRequest =
  async (
    fullName: string,
    login: string,
    password: string,
    role: string
  ) => {
    const response = await api.post(
      "/auth/register",
      {
        fullName,
        login,
        password,
        role,
      }
    );

    return response.data;
  };

export const meRequest = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};

export const logoutRequest =
  async () => {
    const response = await api.post(
      "/auth/logout"
    );

    return response.data;
  };