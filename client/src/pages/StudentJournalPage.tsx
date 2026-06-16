import { useEffect, useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import { getStudentGrades } from "../api/studentGrades";
import { getMyStudentProfileRequest } from "../api/students";

type JournalEntry = {
  lesson: {
    id: number;
    lessonDate: string;
    subject: { name: string } | null;
  };
  value: number | null;
  attendance: { status: string } | null;
};

export default function StudentJournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getMyStudentProfileRequest();
        setStudentName(profile.user.fullName);
        const data = await getStudentGrades(profile.id);
        setEntries(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const sorted = useMemo(
    () =>
      [...entries].sort(
        (a, b) =>
          new Date(a.lesson.lessonDate).getTime() -
          new Date(b.lesson.lessonDate).getTime()
      ),
    [entries]
  );

  const average = useMemo(() => {
    const graded = entries.filter((e) => e.value != null);
    if (graded.length === 0) return "-";
    return (
      graded.reduce((a, e) => a + (e.value || 0), 0) / graded.length
    ).toFixed(1);
  }, [entries]);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-xl font-bold">Загрузка...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Мой журнал</h1>
        <p className="text-gray-500 text-sm mt-1">{studentName}</p>
      </div>

      <div className="overflow-auto bg-white rounded-2xl border border-gray-200">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-2 font-semibold">Дата</th>
              <th className="text-left p-2 font-semibold">Предмет</th>
              <th className="text-center p-2 font-semibold">Оценка</th>
              <th className="text-center p-2 font-semibold">Статус</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.lesson.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2">
                  {new Date(item.lesson.lessonDate).toLocaleDateString("ru-RU")}
                </td>
                <td className="p-2">{item.lesson.subject?.name || "—"}</td>
                <td className="p-2 text-center font-bold">
                  {item.value ?? "—"}
                </td>
                <td className="p-2 text-center">
                  <span
                    className={
                      item.attendance?.status === "ABSENT"
                        ? "text-red-600"
                        : item.attendance?.status === "LATE"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }
                  >
                    {item.attendance?.status === "ABSENT"
                      ? "Н"
                      : item.attendance?.status === "LATE"
                      ? "О"
                      : "✓"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="p-8 text-center text-gray-500">Нет записей</div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Средний балл: <span className="font-bold">{average}</span>
      </div>
    </MainLayout>
  );
}
