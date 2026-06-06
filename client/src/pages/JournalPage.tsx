import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getJournalRequest } from "../api/journal";
import { updateAttendanceRequest } from "../api/attendance";
import { updateGradeRequest } from "../api/grades";
import FilterSelect from "../components/filters/FilterSelect";
import { getGroupsRequest } from "../api/groups";
import { exportCsv } from "../utils/exportCsv";

type JournalType = {
  student: {
    id: number;
    fullName: string;
  };

  expelled: boolean;

  isNew: boolean;

  grades: {
    lessonId: number;
    lessonDate: string;
    value: number | null;
    gradeId: number | null;
  }[];

  attendance: {
    attendanceId: number | null;
    lessonId: number;
    lessonDate: string;
    status: "PRESENT" | "ABSENT" | "LATE";
  }[];
};

type GroupType = {
  id: number;
  name: string;
};

export default function JournalPage() {
  const [journal, setJournal] =
    useState<JournalType[]>([]);

  const [hoveredRow, setHoveredRow] =
    useState<number | null>(null);

  const [groupFilter, setGroupFilter] =
    useState("Все группы");

  const [groups, setGroups] =
    useState<GroupType[]>([]);

  const loadJournal = async () => {
    try {
      const data =
        await getJournalRequest(1);

      setJournal(data.students);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAttendance = async (
    studentId: number,
    lessonId: number,
    status:
      | "PRESENT"
      | "ABSENT"
      | "LATE"
  ) => {
    try {
      await updateAttendanceRequest(
        studentId,
        lessonId,
        status === "PRESENT"
      );

      loadJournal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGrade = async (
    studentId: number,
    lessonId: number,
    currentValue: number | null
  ) => {
    const value = Number(
      prompt(
        "Введите оценку",
        String(currentValue || "")
      )
    );

    if (!value) return;

    try {
      await updateGradeRequest(
        studentId,
        lessonId,
        value
      );

      loadJournal();
    } catch (error) {
      console.log(error);
    }
  };

  const getAverageGrade = (
    grades: {
      value: number | null;
    }[]
  ) => {
    const filtered = grades.filter(
      (g) => g.value !== null
    );

    if (filtered.length === 0)
      return 0;

    const total = filtered.reduce(
      (acc, grade) =>
        acc + Number(grade.value),
      0
    );

    return (
      total / filtered.length
    ).toFixed(1);
  };

  const handleExportCsv = () => {
  const rows: string[][] = [
    ["Студент", "Средний балл"],
    ...journal.map((student) => [
      student.student.fullName,
      String(
        getAverageGrade(
          student.grades
        )
      ),
    ]),
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
        <h1
          className="
            text-4xl
            font-bold
            mb-2
          "
        >
          Электронный журнал
        </h1>

        <p
          className="
            text-gray-500
            mb-4
          "
        >
          Управление
          посещаемостью и
          оценками студентов
        </p>

        <button
          onClick={handleExportCsv}
          className="
            bg-black
            hover:bg-gray-800
            transition
            text-white
            px-4
            py-2
            rounded-xl
          "
        >
          Экспорт CSV
        </button>
      </div>

      <div className="mb-6">
        <FilterSelect
          value={groupFilter}
          onChange={setGroupFilter}
          options={[
            "Все группы",
            ...groups.map((g) => g.name),
          ]}
        />
      </div>

      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-3xl
          overflow-hidden
          shadow-sm
        "
      >
        <div
          className="
            overflow-x-auto
          "
        >
          <table
            className="
              w-full
              border-collapse
            "
          >
            <thead
              className="
                bg-gray-50
              "
            >
              <tr>
                <th
                  className="
                    text-left
                    p-5
                    border-b
                    border-gray-200
                    font-semibold
                    min-w-[260px]
                  "
                >
                  Студент
                </th>

                <th
                  className="
                    text-left
                    p-5
                    border-b
                    border-gray-200
                    font-semibold
                  "
                >
                  Оценки
                </th>

                <th
                  className="
                    text-left
                    p-5
                    border-b
                    border-gray-200
                    font-semibold
                  "
                >
                  Средний балл
                </th>

                <th
                  className="
                    text-left
                    p-5
                    border-b
                    border-gray-200
                    font-semibold
                  "
                >
                  Посещаемость
                </th>
              </tr>
            </thead>

            <tbody>
              {journal.map(
                (item) => (
                  <tr
                    key={
                      item.student.id
                    }
                    onMouseEnter={() =>
                      setHoveredRow(
                        item.student.id
                      )
                    }
                    onMouseLeave={() =>
                      setHoveredRow(
                        null
                      )
                    }
                    className={`
                      transition
                      border-b
                      border-gray-100
                      ${
                        hoveredRow ===
                        item.student.id
                          ? "bg-gray-50"
                          : ""
                      }
                      ${
                        item.expelled
                          ? "opacity-40"
                          : ""
                      }
                    `}
                  >
                    <td className="p-5">
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >
                        <div>
                          <div
                            className="
                              font-semibold
                              text-lg
                            "
                          >
                            {
                              item
                                .student
                                .fullName
                            }
                          </div>

                          <div
                            className="
                              flex
                              gap-2
                              mt-2
                            "
                          >
                            {item.isNew && (
                              <span
                                className="
                                  bg-green-100
                                  text-green-700
                                  px-3
                                  py-1
                                  rounded-full
                                  text-xs
                                  font-medium
                                "
                              >
                                Новый
                              </span>
                            )}

                            {item.expelled && (
                              <span
                                className="
                                  bg-red-100
                                  text-red-700
                                  px-3
                                  py-1
                                  rounded-full
                                  text-xs
                                  font-medium
                                "
                              >
                                Отчислен
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div
                        className="
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        {item.grades.map(
                          (
                            grade
                          ) => (
                            <button
                              key={
                                grade.lessonId
                              }
                              onClick={() =>
                                handleGrade(
                                  item
                                    .student
                                    .id,
                                  grade.lessonId,
                                  grade.value
                                )
                              }
                              className={`
                                w-12
                                h-12
                                rounded-xl
                                font-bold
                                transition
                                border
                                ${
                                  !grade.value
                                    ? "bg-gray-100 border-gray-200 text-gray-500"
                                    : grade.value >=
                                      4
                                    ? "bg-green-100 border-green-200 text-green-700"
                                    : grade.value >=
                                      3
                                    ? "bg-yellow-100 border-yellow-200 text-yellow-700"
                                    : "bg-red-100 border-red-200 text-red-700"
                                }
                                hover:scale-105
                              `}
                            >
                              {grade.value ||
                                "—"}
                            </button>
                          )
                        )}
                      </div>
                    </td>

                    <td className="p-5">
                      <div
                        className="
                          text-2xl
                          font-bold
                        "
                      >
                        {getAverageGrade(
                          item.grades
                        )}
                      </div>
                    </td>

                    <td className="p-5">
                      <div
                        className="
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        {item.attendance.map(
                          (
                            attendance
                          ) => (
                            <button
                              key={
                                attendance.lessonId
                              }
                              onClick={() =>
                                handleAttendance(
                                  item
                                    .student
                                    .id,
                                  attendance.lessonId,
                                  attendance.status ===
                                    "PRESENT"
                                    ? "ABSENT"
                                    : "PRESENT"
                                )
                              }
                              onContextMenu={(
                                e
                              ) => {
                                e.preventDefault();

                                handleAttendance(
                                  item
                                    .student
                                    .id,
                                  attendance.lessonId,
                                  "ABSENT"
                                );
                              }}
                              onMouseDown={(
                                e
                              ) => {
                                if (
                                  e.button ===
                                  1
                                ) {
                                  e.preventDefault();

                                  handleAttendance(
                                    item
                                      .student
                                      .id,
                                    attendance.lessonId,
                                    "LATE"
                                  );
                                }
                              }}
                              className={`
                                w-12
                                h-12
                                rounded-xl
                                border
                                transition
                                text-lg
                                font-bold
                                hover:scale-105

                                ${
                                  attendance.status ===
                                  "PRESENT"
                                    ? "bg-green-100 border-green-200 text-green-700"
                                    : attendance.status ===
                                      "LATE"
                                    ? "bg-yellow-100 border-yellow-200 text-yellow-700"
                                    : "bg-red-100 border-red-200 text-red-700"
                                }
                              `}
                            >
                              {attendance.status ===
                              "PRESENT"
                                ? "✅"
                                : attendance.status ===
                                  "LATE"
                                ? "⏰"
                                : "❌"}
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}