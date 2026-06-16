import React, { useEffect, useState, useMemo, useCallback } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  getJournalRequest,
  getJournalAssignmentsRequest,
  setGradeRequest,
  setAttendanceRequest,
  addJournalLessonRequest,
} from "../api/journal";

type StudentType = {
  id: number;
  expelled: boolean;
  isNew: boolean;
  user: { fullName: string };
};

type LessonType = {
  id: number;
  lessonDate: string;
  subject: { name: string } | null;
};

type GradeType = {
  id: number;
  value: number;
  student: { id: number };
  lesson: { id: number };
};

type AttendanceType = {
  id: number;
  status: string;
  student: { id: number };
  lesson: { id: number };
};

type Assignment = {
  groupId: number;
  groupName: string;
  subjectId: number;
  subjectName: string;
};

function isValidGrade(value: number): boolean {
  return (value >= 2 && value <= 5) || (value >= 7 && value <= 10);
}

export default function JournalPage() {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [grades, setGrades] = useState<GradeType[]>([]);
  const [attendances, setAttendances] = useState<AttendanceType[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const groups = useMemo(() => {
    const map = new Map<number, string>();
    assignments.forEach((a) => map.set(a.groupId, a.groupName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [assignments]);

  const subjectsForGroup = useMemo(() => {
    if (!selectedGroup) return [];
    const gId = Number(selectedGroup);
    return assignments
      .filter((a) => a.groupId === gId)
      .map((a) => ({ id: a.subjectId, name: a.subjectName }));
  }, [assignments, selectedGroup]);

  const loadAssignments = async () => {
    try {
      const data = await getJournalAssignmentsRequest();
      setAssignments(data.assignments || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadJournal = useCallback(async (groupId?: string, subjectId?: string) => {
    if (!groupId || !subjectId) {
      setStudents([]);
      setLessons([]);
      setGrades([]);
      setAttendances([]);
      return;
    }
    setLoading(true);
    try {
      const response = await getJournalRequest(groupId, subjectId);
      setStudents(response.students || []);
      setLessons(response.lessons || []);
      setGrades(response.grades || []);
      setAttendances(response.attendances || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, []);

  const getGrade = (studentId: number, lessonId: number) =>
    grades.find((g) => g.student.id === studentId && g.lesson.id === lessonId);

  const getAttendance = (studentId: number, lessonId: number) =>
    attendances.find((a) => a.student.id === studentId && a.lesson.id === lessonId);

  const handleGrade = async (studentId: number, lessonId: number) => {
    const value = prompt("Введите оценку (2–5 или 7–10):");
    if (!value) return;
    const num = Number(value);
    if (!isValidGrade(num)) {
      alert("Оценка должна быть от 2 до 5 или от 7 до 10");
      return;
    }
    try {
      await setGradeRequest(studentId, lessonId, num);
      await loadJournal(selectedGroup, selectedSubject);
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения оценки");
    }
  };

  const handleAttendance = async (
    studentId: number,
    lessonId: number,
    status: "LATE" | "ABSENT"
  ) => {
    try {
      await setAttendanceRequest(studentId, lessonId, status);
      await loadJournal(selectedGroup, selectedSubject);
    } catch (err) {
      console.error(err);
    }
  };

  const addLesson = async () => {
    if (!selectedGroup || !selectedSubject) {
      alert("Выберите группу и предмет");
      return;
    }
    const dateStr = prompt(
      "Дата урока (YYYY-MM-DD) или оставьте пустым для сегодня:",
      new Date().toISOString().slice(0, 10)
    );
    try {
      await addJournalLessonRequest({
        groupId: Number(selectedGroup),
        subjectId: Number(selectedSubject),
        date: dateStr ? `${dateStr}T10:00:00` : undefined,
      });
      await loadJournal(selectedGroup, selectedSubject);
    } catch (err) {
      console.error(err);
      alert("Ошибка добавления урока");
    }
  };

  const cellClass = (studentId: number, lessonId: number, student: StudentType) => {
    const grade = getGrade(studentId, lessonId);
    const attendance = getAttendance(studentId, lessonId);
    let base = "flex flex-col items-center justify-center h-9 w-full rounded border text-xs transition-colors ";
    if (attendance?.status === "ABSENT") base += "bg-red-100 border-red-300 ";
    else if (attendance?.status === "LATE") base += "bg-yellow-100 border-yellow-300 ";
    else base += "bg-gray-50 border-gray-200 ";
    if (hoverRow === studentId || hoverCol === lessonId) base += "ring-2 ring-blue-300 ";
    if (student.expelled) base += "opacity-50 ";
    return base;
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Электронный журнал</h1>
        <p className="text-gray-500 text-sm mt-1">
          ЛК — оценка · СКМ — опоздание · ПКМ — пропуск
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={selectedGroup}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedGroup(val);
            setSelectedSubject("");
            loadJournal();
          }}
          className="h-10 rounded-lg border border-gray-200 px-3 bg-white text-sm"
        >
          <option value="">Выберите группу</option>
          {groups.map((g) => (
            <option key={g.id} value={String(g.id)}>{g.name}</option>
          ))}
        </select>
        <select
          value={selectedSubject}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedSubject(val);
            if (val && selectedGroup) loadJournal(selectedGroup, val);
          }}
          disabled={!selectedGroup}
          className="h-10 rounded-lg border border-gray-200 px-3 bg-white text-sm disabled:opacity-50"
        >
          <option value="">Выберите предмет</option>
          {subjectsForGroup.map((s) => (
            <option key={s.id} value={String(s.id)}>{s.name}</option>
          ))}
        </select>
        <button
          onClick={addLesson}
          disabled={!selectedGroup || !selectedSubject}
          className="h-10 px-4 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Добавить день (урок)
        </button>
      </div>

      {loading && <div className="text-sm text-gray-500 mb-2">Загрузка...</div>}

      {!selectedGroup || !selectedSubject ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500">
          Выберите группу и предмет для отображения журнала
        </div>
      ) : (
        <div className="overflow-auto bg-white rounded-2xl border border-gray-200 max-h-[70vh]">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-2 min-w-[140px] font-semibold sticky left-0 bg-gray-50">
                  Студент
                </th>
                {lessons.map((lesson) => (
                  <th
                    key={lesson.id}
                    className={`p-1 min-w-[72px] text-center ${hoverCol === lesson.id ? "bg-blue-50" : ""}`}
                    onMouseEnter={() => setHoverCol(lesson.id)}
                    onMouseLeave={() => setHoverCol(null)}
                  >
                    <div className="font-semibold leading-tight">
                      {new Date(lesson.lessonDate).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {new Date(lesson.lessonDate).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </th>
                ))}
                <th className="p-2 min-w-[60px] text-center font-semibold">Ср.</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const studentGrades = grades.filter((g) => g.student.id === student.id);
                const avg =
                  studentGrades.length > 0
                    ? (
                        studentGrades.reduce((a, c) => a + c.value, 0) / studentGrades.length
                      ).toFixed(1)
                    : "-";
                return (
                  <tr
                    key={student.id}
                    className={`border-b border-gray-100 ${hoverRow === student.id ? "bg-blue-50/50" : ""} ${student.expelled ? "bg-gray-100 text-gray-500" : ""} ${student.isNew && !student.expelled ? "bg-green-50/40" : ""}`}
                    onMouseEnter={() => setHoverRow(student.id)}
                    onMouseLeave={() => setHoverRow(null)}
                  >
                    <td className="p-2 font-medium sticky left-0 bg-white border-r border-gray-100">
                      {student.user.fullName}
                      {student.expelled && (
                        <span className="text-[10px] text-gray-400 block">отчислен</span>
                      )}
                      {student.isNew && !student.expelled && (
                        <span className="text-[10px] text-green-600 block">новый</span>
                      )}
                    </td>
                    {lessons.map((lesson) => {
                      const grade = getGrade(student.id, lesson.id);
                      const attendance = getAttendance(student.id, lesson.id);
                      return (
                        <td
                          key={lesson.id}
                          className="p-0.5"
                          onMouseEnter={() => setHoverCol(lesson.id)}
                          onMouseLeave={() => setHoverCol(null)}
                        >
                          <div
                            className={cellClass(student.id, lesson.id, student)}
                            onMouseDown={(e) => {
                              if (e.button === 0) {
                                e.preventDefault();
                                handleGrade(student.id, lesson.id);
                              } else if (e.button === 1) {
                                e.preventDefault();
                                handleAttendance(student.id, lesson.id, "LATE");
                              }
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              handleAttendance(student.id, lesson.id, "ABSENT");
                            }}
                          >
                            <span className="font-bold text-sm leading-none">
                              {grade?.value ?? (attendance?.status === "ABSENT" ? "Н" : attendance?.status === "LATE" ? "О" : "—")}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-2 text-center font-bold">{avg}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {students.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">Нет студентов в группе</div>
          )}
        </div>
      )}
    </MainLayout>
  );
}
