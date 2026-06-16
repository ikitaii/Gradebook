import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GradeCell } from "../components/GradeCell";
import { AttendanceIcon } from "../components/AttendanceIcon";
import { getStudentGrades } from "../api/studentGrades";

export default function StudentGradesPage() {
  const { id } = useParams<{ id: string }>();
  const [gradesData, setGradesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getStudentGrades(parseInt(id));
        setGradesData(data);
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold">Оценки студента</h2>
      {gradesData.length === 0 ? (
        <p>Оценки не найдены</p>
      ) : (
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left">Предмет</th>
              <th className="px-6 py-4 text-left">Оценка</th>
              <th className="px-6 py-4 text-left">Посещаемость</th>
            </tr>
          </thead>
          <tbody>
            {gradesData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {item.lesson?.subject?.name ?? "Нет предмета"}
                </td>
                <td className="px-6 py-4">
                  <GradeCell value={item.value ?? 0} />
                </td>
                <td className="px-6 py-4">
                  <AttendanceIcon status={item.attendance?.status ?? "PRESENT"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}