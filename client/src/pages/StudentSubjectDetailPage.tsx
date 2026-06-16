import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProgramRequest } from "../api/program";
import { getStudentGrades } from "../api/studentGrades";
import { getMyStudentProfileRequest, getMySubjectsRequest } from "../api/students";
import { getLabsRequest } from "../api/labs";

const TYPE_LABELS: Record<string, string> = {
  LAB: "Лабораторная",
  THEORY: "Теория",
  PRACTICE: "Практика",
  TEST: "Контроль / тест",
};

type LabListItem = {
  id: number;
  title: string;
  subjectId?: number;
};

export default function StudentSubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const subjectId = Number(id);
  const [subjectName, setSubjectName] = useState("");
  const [program, setProgram] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [labs, setLabs] = useState<LabListItem[]>([]);

  useEffect(() => {
    if (!subjectId) return;
    const load = async () => {
      try {
        const profile = await getMyStudentProfileRequest();
        const [programItems, gradeData, labsData, subjects] = await Promise.all([
          getProgramRequest(subjectId),
          getStudentGrades(profile.id),
          getLabsRequest(),
          getMySubjectsRequest(),
        ]);
        const sub = subjects.find((s: { id: number }) => s.id === subjectId);
        setSubjectName(sub?.name || "");
        setProgram(programItems);
        setLabs(labsData.filter((l: LabListItem) => l.subjectId === subjectId));
        const filtered = (Array.isArray(gradeData) ? gradeData : []).filter(
          (g: { lesson: { subject?: { id: number } } }) =>
            g.lesson?.subject?.id === subjectId
        );
        setGrades(filtered);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [subjectId]);

  const findLabForProgramItem = (title: string) =>
    labs.find((l) => l.title.includes(title) || title.includes(l.title.split("—").pop()?.trim() || ""));

  return (
    <MainLayout>
      <Link to="/student-subjects" className="text-sm text-gray-500 hover:text-black">
        ← К предметам
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">{subjectName}</h1>

      <h2 className="text-lg font-semibold mb-3">Программа и задания</h2>
      <div className="space-y-3 mb-8">
        {program.map((item) => {
          const linkedLab =
            item.type === "LAB"
              ? findLabForProgramItem(item.title) || labs[0]
              : null;
          return (
            <div key={item.id} className="bg-white border rounded-2xl p-4">
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-500">
                {TYPE_LABELS[item.type] || item.type}
                {item.teamWork && " · командная"}
              </div>
              {item.description && (
                <p className="text-sm mt-2">{item.description}</p>
              )}
              {item.deadline && (
                <p className="text-xs text-gray-500 mt-1">
                  Дедлайн: {new Date(item.deadline).toLocaleString("ru-RU")}
                </p>
              )}
              {item.materialUrl && (
                <a
                  href={item.materialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 mt-2 block"
                >
                  Материалы →
                </a>
              )}
              {linkedLab && (
                <Link
                  to={`/labs/${linkedLab.id}`}
                  className="text-sm text-blue-600 mt-2 block"
                >
                  Открыть лабораторную →
                </Link>
              )}
            </div>
          );
        })}
        {program.length === 0 && (
          <p className="text-gray-500 text-sm">Программа не заполнена</p>
        )}
      </div>

      {labs.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3">Лабораторные работы</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {labs.map((lab) => (
              <Link
                key={lab.id}
                to={`/labs/${lab.id}`}
                className="bg-white border rounded-xl px-4 py-3 text-sm hover:shadow-md"
              >
                {lab.title}
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="text-lg font-semibold mb-3">Оценки по урокам</h2>
      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Дата</th>
              <th className="p-3 text-center">Оценка</th>
              <th className="p-3 text-center">Статус</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.lesson.id} className="border-b">
                <td className="p-3">
                  {new Date(g.lesson.lessonDate).toLocaleDateString("ru-RU")}
                </td>
                <td className="p-3 text-center font-bold">{g.value ?? "—"}</td>
                <td className="p-3 text-center">
                  {g.attendance?.status === "ABSENT"
                    ? "Н"
                    : g.attendance?.status === "LATE"
                    ? "О"
                    : "✓"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {grades.length === 0 && (
          <div className="p-6 text-center text-gray-500">Нет оценок</div>
        )}
      </div>
    </MainLayout>
  );
}
