import {
  useEffect,
  useMemo,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import { useAuth } from "../entities/auth/auth.store";

import { getLessonsRequest } from "../api/lessons";

type LessonType = {
  id: number;

  lessonDate: string;

  topic: string;

  subject: {
    name: string;
  };

  group: {
    name: string;
  };

  teacher: {
    user: {
      fullName: string;
    };
  };
};

export default function SchedulePage() {
  const { user } =
    useAuth();

  const [lessons, setLessons] =
    useState<LessonType[]>(
      []
    );

  const loadLessons =
    async () => {
      try {
        const data =
          await getLessonsRequest();

        setLessons(data);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    loadLessons();
  }, []);

  const groupedLessons =
    useMemo(() => {
      const grouped: Record<
        string,
        LessonType[]
      > = {};

      lessons.forEach(
        (lesson) => {
          const date =
            new Date(
              lesson.lessonDate
            ).toLocaleDateString();

          if (
            !grouped[
              date
            ]
          ) {
            grouped[
              date
            ] = [];
          }

          grouped[
            date
          ].push(
            lesson
          );
        }
      );

      return grouped;
    }, [lessons]);

  return (
    <MainLayout>
      <div className="mb-10">
        <h1
          className="
            text-4xl
            font-bold
            mb-2
          "
        >
          Расписание
        </h1>

        <p
          className="
            text-gray-500
          "
        >
          Актуальное
          расписание занятий
        </p>
      </div>

      <div
        className="
          flex
          flex-col
          gap-8
        "
      >
        {Object.entries(
          groupedLessons
        ).map(
          ([date, dayLessons]) => (
            <div
              key={date}
            >
              <div
                className="
                  text-2xl
                  font-bold
                  mb-5
                "
              >
                {date}
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  xl:grid-cols-2
                  gap-5
                "
              >
                {dayLessons.map(
                  (
                    lesson
                  ) => (
                    <div
                      key={
                        lesson.id
                      }
                      className="
                        bg-white
                        border
                        border-gray-200
                        rounded-3xl
                        p-6
                        shadow-sm
                        hover:shadow-md
                        transition
                      "
                    >
                      <div
                        className="
                          flex
                          justify-between
                          items-start
                          mb-5
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
                                .name
                            }
                          </div>

                          <div
                            className="
                              text-gray-500
                            "
                          >
                            {new Date(
                              lesson.lessonDate
                            ).toLocaleTimeString(
                              [],
                              {
                                hour:
                                  "2-digit",

                                minute:
                                  "2-digit",
                              }
                            )}
                          </div>
                        </div>

                        <div
                          className="
                            bg-black
                            text-white
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-medium
                          "
                        >
                          Пара
                        </div>
                      </div>

                      <div
                        className="
                          flex
                          flex-col
                          gap-3
                          text-gray-700
                        "
                      >
                        <div>
                          <span
                            className="
                              font-semibold
                            "
                          >
                            Группа:
                          </span>{" "}
                          {
                            lesson
                              .group
                              .name
                          }
                        </div>

                        <div>
                          <span
                            className="
                              font-semibold
                            "
                          >
                            Преподаватель:
                          </span>{" "}
                          {
                            lesson
                              .teacher
                              .user
                              .fullName
                          }
                        </div>

                        <div>
                          <span
                            className="
                              font-semibold
                            "
                          >
                            Тема:
                          </span>{" "}
                          {lesson.topic ||
                            "Тема не указана"}
                        </div>
                      </div>

                      {user?.role ===
                        "STUDENT" && (
                        <div
                          className="
                            mt-6
                            bg-gray-50
                            border
                            border-gray-200
                            rounded-2xl
                            p-4
                          "
                        >
                          <div
                            className="
                              text-sm
                              text-gray-500
                              mb-1
                            "
                          >
                            Напоминание
                          </div>

                          <div
                            className="
                              font-medium
                            "
                          >
                            Не забудьте
                            подготовиться
                            к занятию
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )
        )}

        {lessons.length ===
          0 && (
          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-12
              text-center
            "
          >
            <div
              className="
                text-2xl
                font-bold
                mb-3
              "
            >
              Расписание пусто
            </div>

            <div
              className="
                text-gray-500
              "
            >
              Добавьте пары
              через раздел
              управления
              расписанием
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}