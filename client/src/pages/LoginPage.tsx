import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { loginRequest } from "../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [login, setLogin] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin = async () => {
    try {
      setError("");

      const data =
        await loginRequest(
          login,
          password
        );

      localStorage.setItem(
        "token",
        data.accessToken
      );

      navigate("/");
    } catch (error) {
      setError(
        "Ошибка входа"
      );
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
      "
    >
      <div
        className="
          w-[420px]
          bg-white
          p-10
          rounded-2xl
          shadow-md
          border
          border-gray-200
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            mb-8
            text-center
          "
        >
          Вход
        </h1>

        <div className="mb-5">
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) =>
              setLogin(
                e.target.value
              )
            }
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              px-4
              py-3
              outline-none
              focus:border-blue-500
            "
          />
        </div>

        <div className="mb-5">
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              px-4
              py-3
              outline-none
              focus:border-blue-500
            "
          />
        </div>

        {error && (
          <p
            className="
              text-red-500
              mb-4
            "
          >
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="
            w-full
            bg-black
            text-white
            py-3
            rounded-lg
            hover:bg-gray-800
            transition
          "
        >
          Войти
        </button>
      </div>
    </div>
  );
}