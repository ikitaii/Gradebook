import React, { useEffect, useState } from "react";
import { useGrades } from "../entities/grade/grade.store";
import { useGroups } from "../entities/group/group.store";
import { useCourses } from "../entities/course/course.store";
import { useAuth } from "../entities/auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function GradebookPage() {
  const { grades, isLoading, fetchGroupGrades, fetchMyGrades, saveGrade } = useGrades();
  const { groups, fetchGroups } = useGroups();
  const { courses, currentCourse, fetchCourses, fetchCourseById } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();

  
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    fetchCourses();
    if (user?.role === "TEACHER") {
      fetchGroups();
    }
  }, []);

  useEffect(() => {
    if (selectedGroupId && selectedCourseId) {
      fetchGroupGrades(selectedGroupId, selectedCourseId);
      fetchCourseById(selectedCourseId);
    }
  }, [selectedGroupId, selectedCourseId]);

 
  useEffect(() => {
    if (user?.role === "STUDENT" && selectedCourseId) {
      fetchMyGrades(selectedCourseId);
      fetchCourseById(selectedCourseId);
    }
  }, [selectedCourseId]);

  
  const handleCellClick = async (studentId: string, lessonId: string, currentVal?: number) => {
    if (user?.role !== "TEACHER") return;
    const valueStr = prompt(`Enter grade (1-5) for this lesson:`, currentVal?.toString() || "");
    if (valueStr === null) return;  
    
    const value = parseInt(valueStr, 10);
    if (isNaN(value) || value < 1 || value > 5) {
      alert("Please enter a valid number between 1 and 5");
      return;
    }
    const comment = prompt("Enter teacher's comment (optional):") || "";
    await saveGrade(studentId, lessonId, value, comment);
  };

  const allLessons = currentCourse?.modules?.flatMap(m => m.lessons) || [];
  
  const activeGroup = groups.find(g => g.id === selectedGroupId);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/")}>⬅ Back to Dashboard</button>
      <h1>📊 Academic Gradebook</h1>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        {user?.role === "TEACHER" && (
          <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
            <option value="">-- Select Group --</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        )}

        <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
          <option value="">-- Select Course --</option>
          {user?.role === "TEACHER" 
            ? courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)
            : courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>) 
          }
        </select>
      </div>

      {isLoading && <p>Loading gradebook data...</p>}

      {/* ИНТЕРФЕЙС ПРЕПОДАВАТЕЛЯ: Сводная таблица (Матрица) */}
      {!isLoading && user?.role === "TEACHER" && selectedGroupId && selectedCourseId && (
        <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%", marginTop: "10px" }}>
          <thead>
            <tr style={{ backgroundColor: "#eaeaea" }}>
              <th>Student Name</th>
              {allLessons.map(lesson => (
                <th key={lesson.id} title={lesson.title}>
                  {lesson.title.length > 15 ? `${lesson.title.slice(0, 15)}...` : lesson.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
  {activeGroup?.students?.map(
    (student) => (
      <tr key={student.id}>
        <td>
          <strong>
            {student.fullName}
          </strong>
        </td>

        {allLessons.map(
          (lesson) => {
            const gradeObj =
              grades.find(
                (g) =>
                  g.student?.id === student.id &&
                  g.lesson?.id === lesson.id
              );

            return (
              <td
                key={lesson.id}
                onClick={() =>
                  handleCellClick(
                    student.id,
                    lesson.id,
                gradeObj?.value
)
                }
                style={{
                  textAlign:
                    "center",
                  cursor:
                    "pointer",
                  backgroundColor:
                    gradeObj
                      ? "#e2f0d9"
                      : "#fff",
                }}
                title={
                  gradeObj?.comment
                    ? `Comment: ${gradeObj.comment}`
                    : "Click to rate"
                }
              >
                {gradeObj
                  ? gradeObj.value
                  : "-"}
              </td>
            );
          }
        )}
      </tr>
    )
  )}
</tbody>
        </table>
      )}

      {/* ИНТЕРФЕЙС СТУДЕНТА: Карточки успеваемости */}
      {!isLoading && user?.role === "STUDENT" && selectedCourseId && (
        <div style={{ marginTop: "10px" }}>
          <h2>My Performance for: {currentCourse?.title}</h2>
          {allLessons.length === 0 ? <p>No lessons found.</p> : (
            <ul style={{ padding: 0, listStyle: "none" }}>
              {allLessons.map(lesson => {
                const myGrade = grades.find(g => g.lessonId === lesson.id);
                return (
                  <li key={lesson.id} style={{ padding: "10px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between" }}>
                    <span>📄 {lesson.title}</span>
                    <span style={{ fontWeight: "bold", color: myGrade ? "#2ecc71" : "#95a5a6" }}>
                      {myGrade ? `Grade: ${myGrade.value} ${myGrade.comment ? `(${myGrade.comment})` : ""}` : "No grade"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
