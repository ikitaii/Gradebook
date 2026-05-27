import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import { getLessonsRequest } from "../api/lessons";

type LessonType = {
  id: number;

  date: string;

  lessonNumber: number;

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

export default function LessonsPage() {
  const [lessons, setLessons] =
    useState<LessonType[]>([]);

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

  return (
    <MainLayout>
      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Пары
          </h1>

          <p
            className="
              text-gray-500
              mt-1
            "
          >
            Управление учебными парами
          </p>
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-6
              shadow-sm
              hover:shadow-md
              transition
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                mb-5
              "
            >
              <div
                className="
                  text-xl
                  font-bold
                "
              >
                {
                  lesson.subject
                    .name
                }
              </div>

              <div
                className="
                  bg-black
                  text-white
                  px-3
                  py-1
                  rounded-full
                  text-sm
                "
              >
                Пара №
                {
                  lesson.lessonNumber
                }
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
                <span className="font-semibold">
                  Группа:
                </span>{" "}
                {
                  lesson.group
                    .name
                }
              </div>

              <div>
                <span className="font-semibold">
                  Преподаватель:
                </span>{" "}
                {
                  lesson.teacher
                    .user
                    .fullName
                }
              </div>

              <div>
                <span className="font-semibold">
                  Дата:
                </span>{" "}
                {lesson.date}
              </div>
            </div>
          </div>
        ))}
      </div>

      {lessons.length ===
        0 && (
        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            p-10
            text-center
            text-gray-500
            mt-8
          "
        >
          Пары отсутствуют
        </div>
      )}
    </MainLayout>
  );
}