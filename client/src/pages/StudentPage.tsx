import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getStudentsRequest,
  deleteStudentRequest,
} from "../api/students";

type StudentType = {
  id: number;

  expelled: boolean;

  isNew: boolean;

  user: {
    fullName: string;
    login: string;
  };

  group: {
    name: string;
  };
};

export default function StudentsPage() {
  const [students, setStudents] =
    useState<StudentType[]>([]);

  const loadStudents =
    async () => {
      try {
        const data =
          await getStudentsRequest();

        setStudents(data);
      } catch (error) {
        console.log(error);
      }
    };

  const handleDelete =
    async (id: number) => {
      try {
        await deleteStudentRequest(id);

        loadStudents();
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    loadStudents();
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
            Студенты
          </h1>

          <p
            className="
              text-gray-500
              mt-1
            "
          >
            Управление студентами
          </p>
        </div>
      </div>

      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >
        <table className="w-full">
          <thead
            className="
              bg-gray-50
              border-b
              border-gray-200
            "
          >
            <tr>
              <th
                className="
                  text-left
                  px-6
                  py-4
                  font-semibold
                "
              >
                ID
              </th>

              <th
                className="
                  text-left
                  px-6
                  py-4
                  font-semibold
                "
              >
                ФИО
              </th>

              <th
                className="
                  text-left
                  px-6
                  py-4
                  font-semibold
                "
              >
                Логин
              </th>

              <th
                className="
                  text-left
                  px-6
                  py-4
                  font-semibold
                "
              >
                Группа
              </th>

              <th
                className="
                  text-left
                  px-6
                  py-4
                  font-semibold
                "
              >
                Статус
              </th>

              <th
                className="
                  text-right
                  px-6
                  py-4
                  font-semibold
                "
              >
                Действия
              </th>
            </tr>
          </thead>

          <tbody>
            {students.map(
              (student) => (
                <tr
                  key={student.id}
                  className="
                    border-b
                    border-gray-100
                    hover:bg-gray-50
                    transition
                  "
                >
                  <td
                    className="
                      px-6
                      py-4
                    "
                  >
                    {student.id}
                  </td>

                  <td
                    className="
                      px-6
                      py-4
                      font-medium
                    "
                  >
                    {
                      student.user
                        .fullName
                    }
                  </td>

                  <td
                    className="
                      px-6
                      py-4
                      text-gray-600
                    "
                  >
                    {
                      student.user
                        .login
                    }
                  </td>

                  <td
                    className="
                      px-6
                      py-4
                    "
                  >
                    <span
                      className="
                        bg-gray-100
                        px-3
                        py-1
                        rounded-full
                        text-sm
                      "
                    >
                      {
                        student.group
                          .name
                      }
                    </span>
                  </td>

                  <td
                    className="
                      px-6
                      py-4
                    "
                  >
                    {student.expelled ? (
                      <span
                        className="
                          bg-red-100
                          text-red-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                        "
                      >
                        Отчислен
                      </span>
                    ) : (
                      <span
                        className="
                          bg-green-100
                          text-green-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                        "
                      >
                        Активен
                      </span>
                    )}
                  </td>

                  <td
                    className="
                      px-6
                      py-4
                      text-right
                    "
                  >
                    <button
                      onClick={() =>
                        handleDelete(
                          student.id
                        )
                      }
                      className="
                        bg-red-500
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        hover:bg-red-600
                        transition
                      "
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {students.length ===
          0 && (
          <div
            className="
              p-10
              text-center
              text-gray-500
            "
          >
            Студенты отсутствуют
          </div>
        )}
      </div>
    </MainLayout>
  );
}