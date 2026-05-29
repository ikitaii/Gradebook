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

export default function SchedulePage() {
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
      <div className="mb-8">
        <h1
          className="
            text-3xl
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
          Актуальное расписание
        </p>
      </div>

      <div
        className="
          flex
          flex-col
          gap-5
        "
      >
        {lessons.map(
          (lesson) => (
            <div
              key={lesson.id}
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                p-6
                shadow-sm
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >
                <div>
                  <h2
                    className="
                      text-2xl
                      font-semibold
                      mb-2
                    "
                  >
                    {
                      lesson.subject
                        .name
                    }
                  </h2>

                  <div
                    className="
                      text-gray-500
                      mb-2
                    "
                  >
                    Группа:
                    {" "}
                    {
                      lesson.group
                        .name
                    }
                  </div>

                  <div
                    className="
                      text-gray-500
                    "
                  >
                    Преподаватель:
                    {" "}
                    {
                      lesson.teacher
                        .user
                        .fullName
                    }
                  </div>
                </div>

                <div
                  className="
                    text-right
                  "
                >
                  <div
                    className="
                      text-lg
                      font-semibold
                    "
                  >
                    Пара №
                    {
                      lesson.lessonNumber
                    }
                  </div>

                  <div
                    className="
                      text-gray-500
                    "
                  >
                    {
                      lesson.date
                    }
                  </div>
                </div>
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
              p-10
              text-center
              text-gray-500
            "
          >
            Расписание пустое
          </div>
        )}
      </div>
    </MainLayout>
  );
}