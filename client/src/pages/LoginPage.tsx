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
      setError("Login error");
    }
  };

  return (
    <div
      style={{
        height: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "400px",

          padding: "30px",

          border:
            "1px solid #ddd",

          borderRadius: "10px",
        }}
      >
        <h1>Login</h1>

        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) =>
            setLogin(
              e.target.value
            )
          }
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
          }}
        />

        {error && (
          <p
            style={{
              color: "red",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}