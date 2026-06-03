import React from "react";
import { useAuth } from "../entities/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";

// 1. Изменили схему валидации: теперь проверяем login вместо email
const loginSchema = z.object({
  login: z.string().min(2, "Логин должен быть не менее 2 символов"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Передаем login и password на сервер
      await login({ login: data.login, password: data.password });
      toast.success("Вход успешно выполнен! 👋");
      navigate("/");
    } catch (error) {
      toast.error("Неверный логин или пароль");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ padding: "30px", border: "1px solid #ccc", borderRadius: "8px", width: "100%", maxWidth: "320px" }}>
        <h1 style={{ marginTop: 0, marginBottom: "20px" }}>Вход в LMS</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <div>
  {/* Проверьте эту строку: должен быть Логин */}
  <input
    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
    placeholder="Логин" 
    {...register("login")}
  />
  {errors.login && (
    <span style={{ color: "red", fontSize: "12px", marginTop: "4px", display: "block" }}>
      {errors.login.message}
    </span>
  )}
</div>

          <div>
            <input
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
              placeholder="Пароль"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <span style={{ color: "red", fontSize: "12px", marginTop: "4px", display: "block" }}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} style={{ padding: "10px", cursor: "pointer" }}>
            {isSubmitting ? "Вход..." : "Войти"}
          </button>
          
        </form>
      </div>
    </div>
  );
}
