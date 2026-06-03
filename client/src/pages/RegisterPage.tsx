import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { registerRequest } from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] =
    useState("");

  const [login, setLogin] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleRegister =
    async () => {
      try {
        setError("");

        const data =
          await registerRequest(
            fullName,
            login,
            password,
            "STUDENT"
          );

        localStorage.setItem(
          "token",
          data.accessToken
        );

        navigate("/");
      } catch (error) {
        setError(
          "Register error"
        );
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
        <h1>Register</h1>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(
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
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "10px",
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}