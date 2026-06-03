import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useCourses } from "../entities/course/course.store";
import { useAuth } from "../entities/auth/useAuth";
import { useNavigate } from "react-router-dom";

const courseSchema = z.object({
  title: z.string().min(3, "Название курса должно быть длиннее 3 символов"),
  description: z.string().min(10, "Описание должно содержать хотя бы 10 символов"),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CourseListPage() {
  const { courses, isLoading, fetchCourses, createNewCourse } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const onCourseSubmit = async (data: CourseFormData) => {
    try {
      await createNewCourse(data.title, data.description);
      toast.success("Курс успешно создан! 🚀");
      reset(); 
    } catch {
      toast.error("Не удалось создать курс");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Доступные курсы</h1>

      {user?.role === "TEACHER" && (
        <fieldset style={{ marginBottom: "20px", padding: "15px" }}>
          <legend><strong>Панель: Создать новый курс</strong></legend>
          <form onSubmit={handleSubmit(onCourseSubmit)} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
            
            <div>
              <input style={{ width: "100%", padding: "5px" }} placeholder="название курса" {...register("title")} />
              {errors.title && <span style={{ color: "red", fontSize: "12px" }}>{errors.title.message}</span>}
            </div>

            <div>
              <textarea style={{ width: "100%", padding: "5px" }} placeholder="описание курса" {...register("description")} />
              {errors.description && <span style={{ color: "red", fontSize: "12px" }}>{errors.description.message}</span>}
            </div>

            <button type="submit">Создать курс</button>
          </form>
        </fieldset>
      )}

      {isLoading ? (
        <p>Загрузка курсов...</p>
      ) : (
        <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
          {courses.map((course) => (
            <div key={course.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <button onClick={() => navigate(`/courses/${course.id}`)}>Открыть курс</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
