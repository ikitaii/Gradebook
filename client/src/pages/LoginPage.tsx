import React from "react";
import { useAuth } from "../entities/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

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
      await login({ login: data.login, password: data.password });
      toast.success("Вход успешно выполнен! 👋");
      navigate("/");
    } catch (error) {
      toast.error("Неверный логин или пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[420px] bg-white p-10 rounded-2xl shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-center">Вход в LMS</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <input
              type="text"
              placeholder="Логин"
              {...register("login")}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
            {errors.login && (
              <p className="text-red-500 text-sm mt-1">{errors.login.message}</p>
            )}
          </div>

          <div className="mb-5">
            <input
              type="password"
              placeholder="Пароль"
              {...register("password")}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isSubmitting ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
