import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getJournalAssignmentsRequest } from "../api/journal";

type Assignment = {
  groupId: number;
  groupName: string;
  subjectId: number;
  subjectName: string;
};

export default function TeacherProgramPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    getJournalAssignmentsRequest()
      .then((data) => setAssignments(data.assignments || []))
      .catch(console.error);
  }, []);

  const subjects = useMemo(() => {
    const map = new Map<number, { id: number; name: string; groups: string[] }>();
    assignments.forEach((a) => {
      const existing = map.get(a.subjectId);
      if (existing) {
        existing.groups.push(a.groupName);
      } else {
        map.set(a.subjectId, {
          id: a.subjectId,
          name: a.subjectName,
          groups: [a.groupName],
        });
      }
    });
    return Array.from(map.values());
  }, [assignments]);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Программа по предметам</h1>
        <p className="text-gray-500 mt-1">Шаблон занятий: лабы, теория, практика, контрольные</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/subject/${subject.id}`}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
          >
            <div className="text-xl font-bold">{subject.name}</div>
            <div className="text-sm text-gray-500 mt-2">
              Группы: {subject.groups.join(", ")}
            </div>
          </Link>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          Нет назначенных предметов. Добавьте пары в расписание или назначьте преподавателю группу.
        </div>
      )}
    </MainLayout>
  );
}
