import {
  useEffect,
  useState,
} from "react";

import {
  Users,
  GraduationCap,
  CalendarDays,
  FlaskConical,
  ClipboardCheck,
  BookOpen,
  Clock3,
  Upload,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

import { useAuth } from "../entities/auth/auth.store";

import { getDashboardRequest } from "../api/dashboard";

type DashboardData = {
  studentsCount: number;

  teachersCount: number;

  lessonsCount: number;

  labsCount: number;

  averageGrade: string;

  attendancePercent: number;

  latestLessons: any[];
};

export default function DashboardPage() {
  const { user } =
    useAuth();

  const [data, setData] =
    useState<DashboardData | null>(
      null
    );

  const loadDashboard =
    async () => {
      try {
        const response =
          await getDashboardRequest();

        setData(response);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!data) {
    return (
      <MainLayout>
        <div
          className="
            text-2xl
            font-bold
          "
        >
          Загрузка...
        </div>
      </MainLayout>
    );
  }

  const adminCards = [
    {
      title:
        "Студенты",

      value:
        data.studentsCount,

      icon: Users,
    },

    {
      title:
        "Преподаватели",

      value:
        data.teachersCount,

      icon:
        GraduationCap,
    },

    {
      title:
        "Пары",

      value:
        data.lessonsCount,

      icon:
        CalendarDays,
    },

    {
      title:
        "Лабораторные",

      value:
        data.labsCount,

      icon:
        FlaskConical,
    },
  ];

  const teacherCards = [
    {
      title:
        "Пары сегодня",

      value:
        data.lessonsCount,

      icon:
        CalendarDays,
    },

    {
      title:
        "Непроверенные",

      value:
        data.labsCount,

      icon:
        ClipboardCheck,
    },

    {
      title:
        "Группы",

      value:
        3,

      icon:
        BookOpen,
    },

    {
      title:
        "Студенты",

      value:
        data.studentsCount,

      icon:
        Users,
    },
  ];

  const studentCards = [
    {
      title:
        "Средний балл",

      value:
        data.averageGrade,
    },

    {
      title:
        "Посещаемость",

      value: `${data.attendancePercent}%`,
    },

    {
      title:
        "Всего пар",

      value:
        data.lessonsCount,
    },
  ];

  return (
    <MainLayout>
      <div className="mb-10">
        <h1
          className="
            text-5xl
            font-black
            mb-3
          "
        >
          Главная панель
        </h1>

        <p
          className="
            text-gray-500
            text-lg
          "
        >
          Добро пожаловать в
          систему электронного
          журнала
        </p>
      </div>

      {user?.role ===
      "ADMIN" && (
        <>
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-6
              mb-10
            "
          >
            {adminCards.map(
              (card) => {
                const Icon =
                  card.icon;

                return (
                  <div
                    key={
                      card.title
                    }
                    className="
                      bg-white
                      border
                      border-gray-200
                      rounded-3xl
                      p-7
                      shadow-sm
                    "
                  >
                    <div
                      className="
                        flex
                        justify-between
                        items-center
                        mb-6
                      "
                    >
                      <div
                        className="
                          text-gray-500
                        "
                      >
                        {
                          card.title
                        }
                      </div>

                      <div
                        className="
                          w-16
                          h-16
                          rounded-2xl
                          bg-gray-100
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Icon
                          size={
                            30
                          }
                        />
                      </div>
                    </div>

                    <div
                      className="
                        text-6xl
                        font-black
                      "
                    >
                      {
                        card.value
                      }
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-7
              shadow-sm
            "
          >
            <div
              className="
                text-3xl
                font-black
                mb-8
              "
            >
              Система
            </div>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              "
            >
              <div
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-6
                "
              >
                <div
                  className="
                    text-xl
                    font-bold
                    mb-2
                  "
                >
                  Пользователи
                </div>

                <div
                  className="
                    text-gray-500
                  "
                >
                  Управление
                  студентами и
                  преподавателями
                </div>
              </div>

              <div
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-6
                "
              >
                <div
                  className="
                    text-xl
                    font-bold
                    mb-2
                  "
                >
                  Расписание
                </div>

                <div
                  className="
                    text-gray-500
                  "
                >
                  Контроль пар и
                  учебного процесса
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {user?.role ===
      "TEACHER" && (
        <>
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-6
              mb-10
            "
          >
            {teacherCards.map(
              (card) => {
                const Icon =
                  card.icon;

                return (
                  <div
                    key={
                      card.title
                    }
                    className="
                      bg-white
                      border
                      border-gray-200
                      rounded-3xl
                      p-7
                      shadow-sm
                    "
                  >
                    <div
                      className="
                        flex
                        justify-between
                        items-center
                        mb-6
                      "
                    >
                      <div
                        className="
                          text-gray-500
                        "
                      >
                        {
                          card.title
                        }
                      </div>

                      <div
                        className="
                          w-16
                          h-16
                          rounded-2xl
                          bg-gray-100
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Icon
                          size={
                            30
                          }
                        />
                      </div>
                    </div>

                    <div
                      className="
                        text-6xl
                        font-black
                      "
                    >
                      {
                        card.value
                      }
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-7
              shadow-sm
            "
          >
            <div
              className="
                text-3xl
                font-black
                mb-8
              "
            >
              Последние сдачи
            </div>

            <div
              className="
                flex
                flex-col
                gap-5
              "
            >
              <div
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                  flex
                  justify-between
                  items-center
                  flex-wrap
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  <div
                    className="
                      w-14
                      h-14
                      rounded-2xl
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Upload />
                  </div>

                  <div>
                    <div
                      className="
                        text-xl
                        font-bold
                        mb-1
                      "
                    >
                      Иванов И.И.
                    </div>

                    <div
                      className="
                        text-gray-500
                      "
                    >
                      ЛР №2 —
                      React
                    </div>
                  </div>
                </div>

                <div
                  className="
                    text-gray-500
                  "
                >
                  5 минут назад
                </div>
              </div>

              <div
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                  flex
                  justify-between
                  items-center
                  flex-wrap
                  gap-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  <div
                    className="
                      w-14
                      h-14
                      rounded-2xl
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Upload />
                  </div>

                  <div>
                    <div
                      className="
                        text-xl
                        font-bold
                        mb-1
                      "
                    >
                      Петров П.П.
                    </div>

                    <div
                      className="
                        text-gray-500
                      "
                    >
                      ЛР №3 —
                      TypeScript
                    </div>
                  </div>
                </div>

                <div
                  className="
                    text-gray-500
                  "
                >
                  20 минут назад
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {user?.role ===
      "STUDENT" && (
        <>
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
              mb-10
            "
          >
            {studentCards.map(
              (card) => (
                <div
                  key={
                    card.title
                  }
                  className="
                    bg-white
                    border
                    border-gray-200
                    rounded-3xl
                    p-7
                    shadow-sm
                  "
                >
                  <div
                    className="
                      text-gray-500
                      mb-5
                    "
                  >
                    {
                      card.title
                    }
                  </div>

                  <div
                    className="
                      text-6xl
                      font-black
                    "
                  >
                    {
                      card.value
                    }
                  </div>
                </div>
              )
            )}
          </div>

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-7
              shadow-sm
            "
          >
            <div
              className="
                text-3xl
                font-black
                mb-8
              "
            >
              Ближайшие пары
            </div>

            <div
              className="
                flex
                flex-col
                gap-5
              "
            >
              {data.latestLessons.map(
                (
                  lesson
                ) => (
                  <div
                    key={
                      lesson.id
                    }
                    className="
                      border
                      border-gray-200
                      rounded-2xl
                      p-5
                      flex
                      justify-between
                      items-center
                      flex-wrap
                      gap-4
                    "
                  >
                    <div>
                      <div
                        className="
                          text-2xl
                          font-bold
                          mb-2
                        "
                      >
                        {
                          lesson
                            .subject
                            ?.name ||
                            "Без предмета"
                        }
                      </div>

                      <div
                        className="
                          text-gray-500
                        "
                      >
                        {
                          lesson
                            .group
                            ?.name ||
                            "Без группы"
                        }
                      </div>
                    </div>

                    <div
                      className="
                        text-gray-500
                      "
                    >
                      {new Date(
                        lesson.lessonDate
                      ).toLocaleString()}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}