import {
  useEffect,
  useMemo,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import { getJournalRequest } from "../api/journal";

type LessonType = {
  id: number;

  lessonDate: string;

  subject: {
    name: string;
  };
};

type GradeType = {
  value: number;

  lesson: {
    id: number;
  };
};

type AttendanceType = {
  status: string;

  lesson: {
    id: number;
  };
};

export default function StudentJournalPage() {
  const [lessons, setLessons] =
    useState<LessonType[]>(
      []
    );

  const [grades, setGrades] =
    useState<GradeType[]>(
      []
    );

  const [
    attendances,
    setAttendances,
  ] = useState<
    AttendanceType[]
  >([]);

  const loadJournal =
    async () => {
      try {
        const response =
          await getJournalRequest();

        setLessons(
          response.lessons
        );

        setGrades(
          response.grades
        );

        setAttendances(
          response.attendances
        );
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    loadJournal();
  }, []);

  const grouped =
    useMemo(() => {
      const map =
        new Map();

      lessons.forEach(
        (lesson) => {
          const subject =
            lesson.subject
              ?.name ||
            "Без предмета";

          if (
            !map.has(
              subject
            )
          ) {
            map.set(
              subject,
              []
            );
          }

          map.get(subject)
            .push(lesson);
        }
      );

      return Array.from(
        map.entries()
      );
    }, [lessons]);

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
          Мой журнал
        </h1>

        <p
          className="
            text-gray-500
            text-lg
          "
        >
          Успеваемость и
          посещаемость
        </p>
      </div>

      <div
        className="
          overflow-auto
          bg-white
          border
          border-gray-200
          rounded-3xl
        "
      >
        <table className="w-full">
          <thead>
            <tr
              className="
                bg-gray-50
                border-b
                border-gray-200
              "
            >
              <th
                className="
                  p-5
                  text-left
                  min-w-[260px]
                "
              >
                Предмет
              </th>

              {lessons.map(
                (
                  lesson
                ) => (
                  <th
                    key={
                      lesson.id
                    }
                    className="
                      p-4
                      min-w-[90px]
                    "
                  >
                    {new Date(
                      lesson.lessonDate
                    ).getDate()}
                  </th>
                )
              )}

              <th
                className="
                  p-5
                  min-w-[120px]
                "
              >
                Ср.зн
              </th>
            </tr>
          </thead>

          <tbody>
            {grouped.map(
              (
                item: any
              ) => {
                const subject =
                  item[0];

                const subjectLessons =
                  item[1];

                const subjectGrades =
                  grades.filter(
                    (
                      grade
                    ) =>
                      subjectLessons.some(
                        (
                          lesson: LessonType
                        ) =>
                          lesson.id ===
                          grade.lesson
                            .id
                      )
                  );

                const average =
                  subjectGrades.length >
                  0
                    ? (
                        subjectGrades.reduce(
                          (
                            acc,
                            current
                          ) =>
                            acc +
                            current.value,
                          0
                        ) /
                        subjectGrades.length
                      ).toFixed(
                        1
                      )
                    : "-";

                return (
                  <tr
                    key={
                      subject
                    }
                    className="
                      border-b
                      border-gray-100
                    "
                  >
                    <td
                      className="
                        p-5
                        font-semibold
                      "
                    >
                      {
                        subject
                      }
                    </td>

                    {lessons.map(
                      (
                        lesson
                      ) => {
                        const grade =
                          grades.find(
                            (
                              item
                            ) =>
                              item
                                .lesson
                                .id ===
                              lesson.id
                          );

                        const attendance =
                          attendances.find(
                            (
                              item
                            ) =>
                              item
                                .lesson
                                .id ===
                              lesson.id
                          );

                        return (
                          <td
                            key={
                              lesson.id
                            }
                            className="
                              p-3
                              text-center
                            "
                          >
                            <div
                              className="
                                font-bold
                              "
                            >
                              {grade?.value ||
                                ""}
                            </div>

                            <div
                              className="
                                text-xs
                                text-red-500
                              "
                            >
                              {attendance?.status ===
                              "ABSENT"
                                ? "Н"
                                : ""}
                            </div>
                          </td>
                        );
                      }
                    )}

                    <td
                      className="
                        text-center
                        font-black
                      "
                    >
                      {average}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}