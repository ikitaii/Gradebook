import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHomework } from "../entities/homework/homework.store";
import { useAuth } from "../entities/auth/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";


const hwTaskSchema = z.object({
  title: z.string().min(3, "Название задания должно быть длиннее 3 символов"),
  description: z.string().min(10, "Описание задания должно быть подробным (от 10 символов)"),
});

const solutionSchema = z.object({
  text: z.string().min(5, "Решение должно содержать описание или ссылку на работу"),
});

type HwTaskFormData = z.infer<typeof hwTaskSchema>;
type SolutionFormData = z.infer<typeof solutionSchema>;

export default function HomeworkPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { 
    currentHomework, submissions, mySubmission, isLoading,
    fetchHomeworkByLesson, createHomework, fetchSubmissions, fetchMySubmission, sendSolution, checkSubmission 
  } = useHomework();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  
  const [feedbackTexts, setFeedbackTexts] = useState<{[subId: string]: string}>({});

 
  const { register: regTask, handleSubmit: handleTaskSubmit, reset: resetTask, formState: { errors: taskErrors } } = useForm<HwTaskFormData>({
    resolver: zodResolver(hwTaskSchema)
  });

  
  const { register: regSol, handleSubmit: handleSolSubmit, reset: resetSol, formState: { errors: solErrors } } = useForm<SolutionFormData>({
    resolver: zodResolver(solutionSchema)
  });

  useEffect(() => {
    if (lessonId) fetchHomeworkByLesson(lessonId);
  }, [lessonId]);

  useEffect(() => {
    if (currentHomework) {
      if (user?.role === "TEACHER") fetchSubmissions(currentHomework.id);
      if (user?.role === "STUDENT") fetchMySubmission(currentHomework.id);
    }
  }, [currentHomework]);

  const onPublishTask = async (data: HwTaskFormData) => {
    if (!lessonId) return;
    try {
      await createHomework(lessonId, data.title, data.description);
      toast.success("Домашнее задание успешно опубликовано! 📢");
      resetTask();
    } catch {
      toast.error("Не удалось опубликовать задание");
    }
  };

  
  const onSendSolution = async (data: SolutionFormData) => {
    if (!currentHomework) return;
    try {
      await sendSolution(currentHomework.id, data.text);
      toast.success("Решение успешно отправлено на проверку! 🚀");
      resetSol();
    } catch {
      toast.error("Ошибка при отправке решения");
    }
  };

 
  const handleReview = async (submissionId: string, status: "ACCEPTED" | "REJECTED") => {
    const feedback = feedbackTexts[submissionId] || "";
    if (status === "REJECTED" && !feedback.trim()) {
      toast.warning("При отклонении работы обязательно напишите комментарий, что исправить!");
      return;
    }
    try {
      await checkSubmission(submissionId, status, feedback);
      toast.success(status === "ACCEPTED" ? "Работа успешно принята! ✔" : "Работа отправлена на доработку ✖");
     
      setFeedbackTexts(prev => ({ ...prev, [submissionId]: "" }));
    } catch {
      toast.error("Не удалось сохранить результат проверки");
    }
  };

  if (isLoading) return <div style={{ padding: "20px" }}>Загрузка домашнего задания...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>  Назад к структуре курса</button>
      <h1>📝 Домашняя работа к занятию</h1>

      {!currentHomework && (
        <div>
          <p>Для этого занятия домашнее задание еще не создано.</p>
          {user?.role === "TEACHER" && (
            <fieldset style={{ marginTop: "15px", padding: "15px", maxWidth: "450px" }}>
              <legend><strong>Опубликовать домашнее задание</strong></legend>
              <form onSubmit={handleTaskSubmit(onPublishTask)} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <input style={{ width: "100%", padding: "6px" }} placeholder="Название задания (например, Лабораторная №1)" {...regTask("title")} />
                  {taskErrors.title && <span style={{ color: "red", fontSize: "12px" }}>{taskErrors.title.message}</span>}
                </div>
                <div>
                  <textarea style={{ width: "100%", padding: "6px" }} placeholder="Условие задачи и требования к оформлению..." rows={4} {...regTask("description")} />
                  {taskErrors.description && <span style={{ color: "red", fontSize: "12px" }}>{taskErrors.description.message}</span>}
                </div>
                <button type="submit">Опубликовать задание</button>
              </form>
            </fieldset>
          )}
        </div>
      )}

      
      {currentHomework && (
        <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginTop: "15px" }}>
          <h2>🎯 Задание: {currentHomework.title}</h2>
          <p style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: "15px", borderRadius: "4px" }}>{currentHomework.description}</p>
          
          <hr style={{ margin: "20px 0" }} />

         
          {user?.role === "STUDENT" && (
            <div>
              <h3>Ваш ответ</h3>
              {mySubmission ? (
                <div style={{ padding: "15px", borderRadius: "6px", background: mySubmission.status === "ACCEPTED" ? "#e2f0d9" : mySubmission.status === "REJECTED" ? "#fce4d6" : "#fff2cc" }}>
                  <p><strong>Статус проверки:</strong> <code>{mySubmission.status}</code></p>
                  <p><strong>Ваш текст/ссылка:</strong> {mySubmission.solutionText}</p>
                  {mySubmission.teacherFeedback && (
                    <p><strong>Комментарий преподавателя:</strong> <em>{mySubmission.teacherFeedback}</em></p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSolSubmit(onSendSolution)} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
                  <div>
                    <textarea placeholder="Вставьте текст решения или ссылку на репозиторий GitHub / Google Drive..." rows={3} style={{ width: "100%", padding: "6px" }} {...regSol("text")} />
                    {solErrors.text && <span style={{ color: "red", fontSize: "12px" }}>{solErrors.text.message}</span>}
                  </div>
                  <button type="submit">Отправить решение на проверку</button>
                </form>
              )}
            </div>
          )}

          {user?.role === "TEACHER" && (
            <div>
              <h3>Полученные решения студентов ({submissions.length})</h3>
              {submissions.length === 0 ? <p>Студенты пока не отправляли решения.</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {submissions.map((sub) => (
                    <div key={sub.id} style={{ border: "1px dashed #aaa", padding: "15px", borderRadius: "6px", background: sub.status === "ACCEPTED" ? "#f6ffed" : sub.status === "REJECTED" ? "#fff1f0" : "#fffbe6" }}>
                      <p><strong>Студент:</strong> {sub.student?.fullName || "Загрузка..."} (Статус: <code>{sub.status}</code>)</p>
                      <p style={{ background: "#fff", padding: "10px", border: "1px solid #eee" }}><strong>Решение:</strong> {sub.solutionText}</p>
                      {sub.teacherFeedback && <p style={{ color: "#555" }}><strong>Текущий отзыв:</strong> {sub.teacherFeedback}</p>}
                      
                     
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
                        <input 
                          style={{ padding: "6px", flex: 1 }}
                          placeholder="Замечания или похвала..." 
                          value={feedbackTexts[sub.id] || ""} 
                          onChange={(e) => setFeedbackTexts(prev => ({ ...prev, [sub.id]: e.target.value }))} 
                        />
                        <button 
                          onClick={() => handleReview(sub.id, "ACCEPTED")}
                          style={{ backgroundColor: "#52c41a", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" }}
                        >
                          Принять
                        </button>
                        <button 
                          onClick={() => handleReview(sub.id, "REJECTED")}
                          style={{ backgroundColor: "#ff4d4f", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" }}
                        >
                          На доработку
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
