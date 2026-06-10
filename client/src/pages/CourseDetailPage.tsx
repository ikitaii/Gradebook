import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "../entities/course/course.store";
import { useAuth } from "../entities/auth/useAuth";
import { courseApi } from "../entities/course/course.api";
import { useGroups } from "../entities/group/group.store";

type TabType = "lessons" | "students";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { currentCourse, isLoading, fetchCourseById } = useCourses();
  const { groups, fetchGroups } = useGroups();
  const { user } = useAuth();
  const navigate = useNavigate();

 
  const [activeTab, setActiveTab] = useState<TabType>("lessons");

  useEffect(() => {
    if (id) fetchCourseById(id);
    fetchGroups(); 
  }, [id]);

  const handleAddModule = async () => {
    const title = prompt("Введите название модуля:");
    if (!title || !id) return;
    try {
      await courseApi.createModule({ courseId: id, title });
      fetchCourseById(id);
    } catch {
      alert("Ошибка при создании модуля");
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    const title = prompt("Введите название занятия:");
    const content = prompt("Введите текст лекции:");
    if (!title || !content) return;
    try {
      await courseApi.createLesson({ moduleId, title, content });
      fetchCourseById(id!);
    } catch {
      alert("Ошибка при создании занятия");
    }
  };

  if (isLoading) return <div style={{ padding: "20px" }}>Загрузка данных курса...</div>;
  if (!currentCourse) return <div style={{ padding: "20px" }}>Курс не найден.</div>;

  
  const assignedStudents = groups
    .filter(g => g.courses?.some(c => c.id === currentCourse.id))
    .flatMap(g => g.students || []);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/courses")}>⬅ Назад к курсам</button>
      
      <h1>{currentCourse.title}</h1>
      <p>{currentCourse.description}</p>

     
      <div style={{ display: "flex", gap: "10px", margin: "20px 0", borderBottom: "2px solid #ccc", paddingBottom: "10px" }}>
        <button 
          onClick={() => setActiveTab("lessons")} 
          style={{ padding: "10px 20px", cursor: "pointer", fontWeight: activeTab === "lessons" ? "bold" : "normal", backgroundColor: activeTab === "lessons" ? "#ddd" : "#fff" }}
        >
          📚 Занятия и Модули
        </button>
        <button 
          onClick={() => setActiveTab("students")} 
          style={{ padding: "10px 20px", cursor: "pointer", fontWeight: activeTab === "students" ? "bold" : "normal", backgroundColor: activeTab === "students" ? "#ddd" : "#fff" }}
        >
          👨‍🎓 Студенты курса ({assignedStudents.length})
        </button>
      </div>

     
      {activeTab === "lessons" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Структура обучения</h2>
            {user?.role === "TEACHER" && (
              <button onClick={handleAddModule} style={{ backgroundColor: "#4CAF50", color: "white", padding: "8px 12px" }}>+ Добавить модуль</button>
            )}
          </div>

          {currentCourse.modules?.length === 0 ? (
            <p>В этом курсе пока нет учебных модулей.</p>
          ) : (
            currentCourse.modules?.map((mod) => (
              <div key={mod.id} style={{ border: "1px dashed #777", margin: "15px 0", padding: "15px", borderRadius: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3>📦 Модуль: {mod.title}</h3>
                  {user?.role === "TEACHER" && (
                    <button onClick={() => handleAddLesson(mod.id)} style={{ fontSize: "12px" }}>+ Добавить занятие</button>
                  )}
                </div>

                <ul style={{ paddingLeft: "20px" }}>
                  {mod.lessons?.map((lesson) => (
                    <li key={lesson.id} style={{ marginBottom: "15px", padding: "10px", borderRadius: "4px", background: "#fcfcfc", border: "1px solid #eee" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong>📄 {lesson.title}</strong>
                        <button 
                          onClick={() => navigate(`/lesson/${lesson.id}/homework`)}
                          style={{ fontSize: "12px", padding: "5px 10px", backgroundColor: "#008CBA", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Домашнее задание 📝
                        </button>
                      </div>
                      <p style={{ margin: "5px 0 0 0", color: "#555", fontSize: "14px" }}>{lesson.content}</p>
                    </li>
                  ))}
                  {mod.lessons?.length === 0 && <p style={{ color: "#999", fontSize: "12px" }}>В этом модуле еще нет уроков.</p>}
                </ul>
              </div>
            ))
          )}
        </div>
      )}

    
      {activeTab === "students" && (
        <div>
          <h2>Список учащихся на курсе</h2>
          {assignedStudents.length === 0 ? (
            <p>Ни одна учебная группа пока не подключена к этому курсу.</p>
          ) : (
            <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%", maxWidth: "600px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th>ФИО Студента</th>
                </tr>
              </thead>
              <tbody>
                {assignedStudents.map((student, idx) => (
                  <tr key={student.id + idx}>
                    <td><strong>{student.fullName}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
