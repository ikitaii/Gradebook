import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getMySubjectsRequest } from "../api/students";

type Subject = { id: number; name: string };

export default function StudentSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    getMySubjectsRequest()
      .then(setSubjects)
      .catch(console.error);
  }, []);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Предметы</h1>
        <p className="text-gray-500 mt-1">Дисциплины вашей группы по расписанию</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/student-subjects/${subject.id}`}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
          >
            <div className="text-xl font-bold">{subject.name}</div>
            <div className="text-gray-500 text-sm mt-2">Подробная успеваемость →</div>
          </Link>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          Предметы не найдены. Администратор должен добавить расписание для вашей группы.
        </div>
      )}
    </MainLayout>
  );
}
