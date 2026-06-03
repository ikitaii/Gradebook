import { useEffect, useState } from "react";
import { api } from "../api/axios";

export const JournalPage = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/journal?groupId=1&subjectId=1")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Journal</h1>

      <table border={1}>
        <thead>
          <tr>
            <th>Student</th>
            {data.lessons.map((l: any) => (
              <th key={l.id}>
                {new Date(l.lessonDate).toLocaleDateString()}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.students.map((s: any) => (
            <tr key={s.id}>
              <td>{s.name}</td>

              {data.lessons.map((l: any) => {
                const grade = data.grades.find(
                  (g: any) =>
                    g.student.id === s.id &&
                    g.lesson.id === l.id
                );

                return (
  <td
    key={l.id}
    onClick={() => {
      const value = prompt("Введите оценку");

      if (!value) return;

      api.post("/journal/grade", {
        studentId: s.id,
        lessonId: l.id,
        value: Number(value),
      }).then(() => {
        window.location.reload();
      });
    }}
    style={{ cursor: "pointer" }}
  >
    {grade?.value || "+"}
  </td>
);
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};