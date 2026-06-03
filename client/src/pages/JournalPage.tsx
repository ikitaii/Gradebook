import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getJournalRequest } from "../api/journal";
import { updateAttendanceRequest } from "../api/attendance";
import { updateGradeRequest } from "../api/grades";
import FilterSelect from "../components/filters/FilterSelect";
import { getGroupsRequest } from "../api/groups";
import { exportCsv } from "../utils/exportCsv";

type LessonType = {
  id: number;
  date: string;
};

type StudentJournalType = {
  student: {
    id: number;
    fullName: string;
  };
  grades: {
    id: number;
    value: number;
    lessonId: number;
  }[];
  attendance: {
    id: number;
    present: boolean;
    lessonId: number;
  }[];
};

type GroupType = {
  id: number;
  name: string;
};

export default function JournalPage() {
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [students, setStudents] = useState<StudentJournalType[]>([]);
  const [groupFilter, setGroupFilter] = useState("Все группы");
  const [groups, setGroups] = useState<GroupType[]>([]);

  const loadJournal = async () => {
    try {
      const data = await getJournalRequest(1);
      setLessons(data.lessons);
      setStudents(data.students);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAttendance = async (studentId: number, lessonId: number, present: boolean) => {
    try {
      await updateAttendanceRequest(studentId, lessonId, present);
      loadJournal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGrade = async (studentId: number, lessonId: number) => {
    const value = Number(prompt("Введите оценку"));
    if (!value) return;

    try {
      await updateGradeRequest(studentId, lessonId, value);
      loadJournal();
    } catch (error) {
      console.log(error);
    }
  };

  const getGradeColor = (value: number) => {
    if (value >= 8) return "bg-green-100 text-green-700";
    if (value >= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const handleExportCsv = () => {
    const rows = [
      ["Студент"],
      ...students.map((student) => [student.student.fullName]),
    ];
    exportCsv("journal", rows);
  };

  useEffect(() => {
    loadJournal();
    getGroupsRequest().then((data) => {
      setGroups(data);
    });
  }, []);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Электронный журнал</h1>
        <p className="text-gray-500 mt-1">Успеваемость и посещаемость</p>
        <button
          onClick={handleExportCsv}
          className="bg-black hover:bg-gray-800 transition text-white px-4 py-2 rounded-xl mt-4"
        >
          Экспорт CSV
        </button>
      </div>

      <div className="mb-6">
        <FilterSelect
          value={groupFilter}
          onChange={setGroupFilter}
          options={["Все группы", ...groups.map((g) => g.name)]}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-4 text-left font-semibold min-w-[220px]">Студент</th>
              {lessons.map((lesson) => (
                <th key={lesson.id} className="px-4 py-4 text-center font-semibold min-w-[120px]">
                  {lesson.date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((item) => (
              <tr key={item.student.id} className="border-b border-gray-100 hover:bg-gray-100 transition">
                <td className="px-6 py-5 font-medium">{item.student.fullName}</td>
                {lessons.map((lesson) => {
                  const grade = item.grades.find((g) => g.lessonId === lesson.id);
                  const attendance = item.attendance.find((a) => a.lessonId === lesson.id);

                  return (
                    <td key={lesson.id} className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span 
                          onClick={() => handleGrade(item.student.id, lesson.id)}
                          className={`px-2 py-1 rounded cursor-pointer text-sm font-semibold ${grade ? getGradeColor(grade.value) : 'bg-gray-50 text-gray-400'}`}
                        >
                          {grade?.value || "-"}
                        </span>
                        <input 
                          type="checkbox"
                          checked={attendance?.present ?? true}
                          onChange={(e) => handleAttendance(item.student.id, lesson.id, e.target.checked)}
                          className="rounded text-black focus:ring-black"
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
