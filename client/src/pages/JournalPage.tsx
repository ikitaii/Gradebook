import {
  useEffect,
  useMemo,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getJournalRequest,
  setGradeRequest,
  setAttendanceRequest,
} from "../api/journal";

import { getGroupsRequest } from "../api/groups";

import { getSubjectsRequest } from "../api/subject";

import { useAuth } from "../entities/auth/auth.store";

type StudentType = {
  id: number;

  expelled: boolean;

  isNew: boolean;

  user: {
    fullName: string;
  };
};

type LessonType = {
  id: number;

  lessonDate: string;

  subject: {
    name: string;
  } | null;
};

type GradeType = {
  id: number;

  value: number;

  student: {
    id: number;
  };

  lesson: {
    id: number;
  };
};

type AttendanceType = {
  id: number;

  status: string;

  student: {
    id: number;
  };

  lesson: {
    id: number;
  };
};

type GroupType = {
  id: number;

  name: string;
};

type SubjectType = {
  id: number;

  name: string;
};

export default function JournalPage() {
  const { user } =
    useAuth();

  const [students, setStudents] =
    useState<StudentType[]>(
      []
    );

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

  const [groups, setGroups] =
    useState<GroupType[]>(
      []
    );

  const [subjects, setSubjects] =
    useState<
      SubjectType[]
    >([]);

  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState("");

  const [
    selectedSubject,
    setSelectedSubject,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

 const loadJournal =
  async (
    groupId?: string,
    subjectId?: string
  ) => {
      try {
        const response =
          await getJournalRequest(
            groupId,
            subjectId
          );

        setStudents(
          response.students || []
        );

        setLessons(
          response.lessons || []
        );

        setGrades(
          response.grades || []
        );

        setAttendances(
          response.attendances ||
            []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const loadFilters =
    async () => {
      try {
        const groupsData =
          await getGroupsRequest();

        const subjectsData =
          await getSubjectsRequest();

        setGroups(
          groupsData
        );

        setSubjects(
          subjectsData
        );
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    loadFilters();

    loadJournal();
  }, []);

  const getGrade =
    (
      studentId: number,
      lessonId: number
    ) => {
      return grades.find(
        (grade) =>
          grade.student.id ===
            studentId &&
          grade.lesson.id ===
            lessonId
      );
    };

  const getAttendance =
    (
      studentId: number,
      lessonId: number
    ) => {
      return attendances.find(
        (
          attendance
        ) =>
          attendance.student.id ===
            studentId &&
          attendance.lesson.id ===
            lessonId
      );
    };

  const setGrade =
    async (
      studentId: number,
      lessonId: number
    ) => {
      const value =
        prompt(
          "Введите оценку"
        );

      if (!value) {
        return;
      }

      try {
        await setGradeRequest(
          studentId,
          lessonId,
          Number(value)
        );

        loadJournal(
          selectedGroup,
          selectedSubject
        );
      } catch (error) {
        console.log(error);
      }
    };

  const setAttendance =
    async (
      event: React.MouseEvent,
      studentId: number,
      lessonId: number
    ) => {
      event.preventDefault();

      let status =
        "ABSENT";

      if (
        event.button === 1
      ) {
        status = "LATE";
      }

      try {
        await setAttendanceRequest(
          studentId,
          lessonId,
          status
        );

        loadJournal(
          selectedGroup,
          selectedSubject
        );
      } catch (error) {
        console.log(error);
      }
    };

  const studentAverage =
    useMemo(() => {
      const values =
        grades.map(
          (grade) =>
            grade.value
        );

      if (
        values.length === 0
      ) {
        return 0;
      }

      return (
        values.reduce(
          (
            acc,
            current
          ) =>
            acc +
            current,
          0
        ) / values.length
      ).toFixed(1);
    }, [grades]);

  const attendancePercent =
    useMemo(() => {
      if (
        attendances.length ===
        0
      ) {
        return 100;
      }

      const present =
        attendances.filter(
          (
            attendance
          ) =>
            attendance.status ===
            "PRESENT"
        ).length;

      return Math.round(
        (present /
          attendances.length) *
          100
      );
    }, [attendances]);

  if (loading) {
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

  if (
    user?.role ===
    "STUDENT"
  ) {
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
            Мои оценки
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
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            mb-10
          "
        >
          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-8
            "
          >
            <div
              className="
                text-gray-500
                mb-4
              "
            >
              Средний балл
            </div>

            <div
              className="
                text-6xl
                font-black
              "
            >
              {
                studentAverage
              }
            </div>
          </div>

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-8
            "
          >
            <div
              className="
                text-gray-500
                mb-4
              "
            >
              Посещаемость
            </div>

            <div
              className="
                text-6xl
                font-black
              "
            >
              {
                attendancePercent
              }
              %
            </div>
          </div>
        </div>

        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-3xl
            overflow-hidden
          "
        >
          <div
            className="
              grid
              grid-cols-3
              bg-gray-50
              border-b
              border-gray-200
              font-bold
            "
          >
            <div className="p-5">
              Предмет
            </div>

            <div className="p-5">
              Оценка
            </div>

            <div className="p-5">
              Посещение
            </div>
          </div>

          {lessons.map(
            (lesson) => {
              const grade =
                grades.find(
                  (
                    item
                  ) =>
                    item.lesson
                      .id ===
                    lesson.id
                );

              const attendance =
                attendances.find(
                  (
                    item
                  ) =>
                    item.lesson
                      .id ===
                    lesson.id
                );

              return (
                <div
                  key={
                    lesson.id
                  }
                  className="
                    grid
                    grid-cols-3
                    border-b
                    border-gray-100
                  "
                >
                  <div className="p-5 font-semibold">
                    {
                      lesson
                        .subject
                        ?.name ||
                        "Без предмета"
                    }
                  </div>

                  <div className="p-5">
                    {grade
                      ?.value ||
                      "-"}
                  </div>

                  <div className="p-5">
                    {attendance
                      ?.status ||
                      "PRESENT"}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </MainLayout>
    );
  }

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
          Электронный журнал
        </h1>

        <p
          className="
            text-gray-500
            text-lg
          "
        >
          Управление
          посещаемостью и
          оценками
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          mb-8
        "
      >
        <select
          value={
            selectedGroup
          }
          onChange={(
            event
          ) => {
            setSelectedGroup(
              event.target.value
            );

            loadJournal(
              event.target.value,
              selectedSubject
            );
          }}
          className="
            h-[64px]
            rounded-2xl
            border
            border-gray-200
            px-5
            bg-white
          "
        >
          <option value="">
            Выберите группу
          </option>

          {groups.map(
            (group) => (
              <option
                key={
                  group.id
                }
                value={String(
                  group.id
                )}
              >
                {group.name}
              </option>
            )
          )}
        </select>

        <select
          value={
            selectedSubject
          }
          onChange={(
            event
          ) => {
            setSelectedSubject(
              event.target.value
            );

            loadJournal(
              selectedGroup,
              event.target.value
            );
          }}
          className="
            h-[64px]
            rounded-2xl
            border
            border-gray-200
            px-5
            bg-white
          "
        >
          <option value="">
            Выберите предмет
          </option>

          {subjects.map(
            (
              subject
            ) => (
              <option
                key={
                  subject.id
                }
                value={String(
                  subject.id
                )}
              >
                {
                  subject.name
                }
              </option>
            )
          )}
        </select>
      </div>

      <div
        className="
          overflow-auto
          bg-white
          rounded-3xl
          border
          border-gray-200
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
                  text-left
                  p-5
                  min-w-[250px]
                "
              >
                Студент
              </th>

              {lessons.map(
                (lesson) => (
                  <th
                    key={
                      lesson.id
                    }
                    className="
                      p-4
                      min-w-[120px]
                    "
                  >
                    <div
                      className="
                        text-sm
                        font-bold
                        mb-1
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
                        text-xs
                        text-gray-500
                      "
                    >
                      {new Date(
                        lesson.lessonDate
                      ).toLocaleDateString()}
                    </div>
                  </th>
                )
              )}

              <th
                className="
                  p-5
                  min-w-[160px]
                "
              >
                Средний балл
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map(
              (
                student
              ) => {
                const studentGrades =
                  grades.filter(
                    (
                      grade
                    ) =>
                      grade
                        .student
                        .id ===
                      student.id
                  );

                const average =
                  studentGrades.length >
                  0
                    ? (
                        studentGrades.reduce(
                          (
                            acc,
                            current
                          ) =>
                            acc +
                            current.value,
                          0
                        ) /
                        studentGrades.length
                      ).toFixed(
                        1
                      )
                    : "-";

                return (
                  <tr
                    key={
                      student.id
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
                        student
                          .user
                          .fullName
                      }
                    </td>

                    {lessons.map(
                      (
                        lesson
                      ) => {
                        const grade =
                          getGrade(
                            student.id,
                            lesson.id
                          );

                        const attendance =
                          getAttendance(
                            student.id,
                            lesson.id
                          );

                        return (
                          <td
                            key={
                              lesson.id
                            }
                            className="
                              p-2
                            "
                          >
                            <div
                              onClick={() =>
                                setGrade(
                                  student.id,
                                  lesson.id
                                )
                              }
                              onContextMenu={(
                                event
                              ) =>
                                setAttendance(
                                  event,
                                  student.id,
                                  lesson.id
                                )
                              }
                              onMouseDown={(
                                event
                              ) => {
                                if (
                                  event.button ===
                                  1
                                ) {
                                  setAttendance(
                                    event,
                                    student.id,
                                    lesson.id
                                  );
                                }
                              }}
                              className={`
                                h-[70px]
                                rounded-2xl
                                flex
                                flex-col
                                items-center
                                justify-center
                                cursor-pointer
                                border-2
                                ${
                                  attendance?.status ===
                                  "ABSENT"
                                    ? "bg-red-100 border-red-300"
                                    : attendance?.status ===
                                      "LATE"
                                    ? "bg-yellow-100 border-yellow-300"
                                    : "bg-gray-50 border-gray-200"
                                }
                              `}
                            >
                              <div
                                className="
                                  text-2xl
                                  font-black
                                "
                              >
                                {grade
                                  ?.value ||
                                  "-"}
                              </div>

                              <div
                                className="
                                  text-xs
                                  text-gray-500
                                "
                              >
                                {attendance?.status ||
                                  "PRESENT"}
                              </div>
                            </div>
                          </td>
                        );
                      }
                    )}

                    <td
                      className="
                        text-center
                        font-black
                        text-xl
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