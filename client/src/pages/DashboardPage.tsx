import { useEffect, useState } from "react";
import { CalendarDays, FlaskConical, ClipboardCheck, Users } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../entities/auth/auth.store";
import { getDashboardRequest } from "../api/dashboard";

type DashboardData = {
  role?: string;
  studentsCount?: number;
  teachersCount?: number;
  lessonsCount?: number;
  labsCount?: number;
  averageGrade?: string;
  attendancePercent?: number;
  latestLessons?: any[];
  todayLessons?: any[];
  todaySchedule?: any[];
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardRequest()
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <MainLayout>
        <div className="text-2xl font-bold">Загрузка...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Главная</h1>
        <p className="text-gray-500">
          {user?.role === "TEACHER"
            ? "Расписание пар на сегодня"
            : user?.role === "STUDENT"
            ? "Расписание вашей группы на сегодня"
            : "Панель управления"}
        </p>
      </div>

      {user?.role === "TEACHER" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border rounded-2xl p-6">
              <div className="text-gray-500 text-sm mb-2">Пары сегодня</div>
              <div className="text-4xl font-black">{data.lessonsCount ?? 0}</div>
            </div>
            <div className="bg-white border rounded-2xl p-6">
              <div className="text-gray-500 text-sm mb-2">Лабораторные</div>
              <div className="text-4xl font-black">{data.labsCount ?? 0}</div>
            </div>
            <div className="bg-white border rounded-2xl p-6">
              <div className="text-gray-500 text-sm mb-2">Студенты</div>
              <div className="text-4xl font-black">{data.studentsCount ?? 0}</div>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarDays size={22} /> Пары сегодня
            </h2>
            <div className="space-y-3">
              {(data.todayLessons || []).map((lesson: any) => (
                <div
                  key={lesson.id}
                  className="border rounded-xl p-4 flex justify-between items-center flex-wrap gap-2"
                >
                  <div>
                    <div className="font-bold text-lg">
                      {lesson.subject?.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {lesson.group?.name}
                    </div>
                  </div>
                  <div className="text-gray-500">
                    {new Date(lesson.lessonDate).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
              {(data.todayLessons || []).length === 0 && (
                <p className="text-gray-500 text-sm">Сегодня пар нет</p>
              )}
            </div>
          </div>
        </>
      )}

      {user?.role === "STUDENT" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border rounded-2xl p-6">
              <div className="text-gray-500 text-sm mb-2">Средний балл</div>
              <div className="text-4xl font-black">{data.averageGrade ?? "—"}</div>
            </div>
            <div className="bg-white border rounded-2xl p-6">
              <div className="text-gray-500 text-sm mb-2">Посещаемость</div>
              <div className="text-4xl font-black">
                {data.attendancePercent ?? 0}%
              </div>
            </div>
            <div className="bg-white border rounded-2xl p-6">
              <div className="text-gray-500 text-sm mb-2">Пар сегодня</div>
              <div className="text-4xl font-black">{data.lessonsCount ?? 0}</div>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarDays size={22} /> Расписание на сегодня
            </h2>
            <div className="space-y-3">
              {(data.todaySchedule || []).map((slot: any) => (
                <div
                  key={slot.id}
                  className="border rounded-xl p-4 flex justify-between items-center flex-wrap gap-2"
                >
                  <div>
                    <div className="font-bold text-lg">{slot.subject?.name}</div>
                    <div className="text-gray-500 text-sm">
                      {slot.teacher?.user?.fullName}
                      {slot.room && ` · ауд. ${slot.room}`}
                    </div>
                  </div>
                  <div className="text-gray-500">
                    {slot.startTime} — {slot.endTime}
                  </div>
                </div>
              ))}
              {(data.todaySchedule || []).length === 0 && (
                <p className="text-gray-500 text-sm">Сегодня пар нет</p>
              )}
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}
