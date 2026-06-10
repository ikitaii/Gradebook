import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getJournalRequest,
  setGradeRequest,
  setAttendanceRequest,
} from "../api/journal";

import { getSubjectsRequest } from "../api/subject";

import { getGroupsRequest } from "../api/groups";

type StudentType = {
  id: number;

  user: {
    fullName: string;
  };
};

type LessonType = {
  id: number;

  lessonDate: string;

  subject: {
    name: string;
  };
};

type GradeType = {
  value: number;

  student: {
    id: number;
  };

  lesson: {
    id: number;
  };
};

type AttendanceType = {
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

export default function TeacherJournalPage() {
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

  const [subjects, setSubjects] =
    useState<
      SubjectType[]
    >([]);

  const [groups, setGroups] =
    useState<GroupType[]>(
      []
    );

  const [
    selectedSubject,
    setSelectedSubject,
  ] = useState("");

  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState("");

  const loadSubjects =
    async () => {
      try {
        const data =
          await getSubjectsRequest();

        setSubjects(
          data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const loadGroups =
    async () => {
      try {
        const data =
          await getGroupsRequest();

        setGroups(
          data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const loadJournal =
    async () => {
      if (
        !selectedGroup ||
        !selectedSubject
      ) {
        return;
      }

      try {
        const response =
          await getJournalRequest(
            selectedGroup,
            selectedSubject
          );

        setStudents(
          response.students
        );

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
    loadSubjects();

    loadGroups();
  }, []);

  useEffect(() => {
    loadJournal();
  }, [
    selectedGroup,
    selectedSubject,
  ]);

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
          Журнал
        </h1>

        <p
          className="
            text-gray-500
            text-lg
          "
        >
          Управление
          оценками и
          посещаемостью
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
            selectedSubject
          }
          onChange={(
            event
          ) =>
            setSelectedSubject(
              event.target.value
            )
          }
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

        <select
          value={
            selectedGroup
          }
          onChange={(
            event
          ) =>
            setSelectedGroup(
              event.target.value
            )
          }
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
      </div>

      {selectedGroup &&
        selectedSubject && (
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
                      min-w-[260px]
                    "
                  >
                    Студент
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
                          min-w-[120px]
                        "
                      >
                        <div
                          className="
                            text-xs
                            text-gray-500
                            mb-1
                          "
                        >
                          {new Date(
                            lesson.lessonDate
                          ).toLocaleDateString()}
                        </div>

                        <div
                          className="
                            text-sm
                            font-bold
                          "
                        >
                          {
                            lesson
                              .subject
                              .name
                          }
                        </div>
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {students.map(
                  (
                    student
                  ) => (
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
                                onClick={async () => {
                                  const value =
                                    prompt(
                                      "Введите оценку"
                                    );

                                  if (
                                    !value
                                  ) {
                                    return;
                                  }

                                  await setGradeRequest(
                                    student.id,
                                    lesson.id,
                                    Number(
                                      value
                                    )
                                  );

                                  loadJournal();
                                }}
                                onContextMenu={async (
                                  event
                                ) => {
                                  event.preventDefault();

                                  await setAttendanceRequest(
                                    student.id,
                                    lesson.id,
                                    "ABSENT"
                                  );

                                  loadJournal();
                                }}
                                className={`
                                  h-[72px]
                                  rounded-2xl
                                  border-2
                                  flex
                                  flex-col
                                  items-center
                                  justify-center
                                  cursor-pointer
                                  ${
                                    attendance?.status ===
                                    "ABSENT"
                                      ? "bg-red-100 border-red-300"
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
                                  {grade?.value ||
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
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
    </MainLayout>
  );
}