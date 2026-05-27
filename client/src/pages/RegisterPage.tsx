import { useState } from "react";

import { registerRequest } from "../api/auth";

export default function RegisterPage() {
  const [fullName, setFullName] =
    useState("");

  const [login, setLogin] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister =
    async () => {
      try {
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

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div>
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
      />

      <input
        type="text"
        placeholder="Login"
        value={login}
        onChange={(e) =>
          setLogin(e.target.value)
        }
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
      />

      <button
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
}