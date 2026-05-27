import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getSubjectsRequest,
  createSubjectRequest,
  deleteSubjectRequest,
} from "../api/subject";

type SubjectType = {
  id: number;
  name: string;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] =
    useState<SubjectType[]>([]);

  const [name, setName] =
    useState("");

  const loadSubjects =
    async () => {
      try {
        const data =
          await getSubjectsRequest();

        setSubjects(data);
      } catch (error) {
        console.log(error);
      }
    };

  const handleCreate =
    async () => {
      try {
        if (!name.trim()) return;

        await createSubjectRequest(
          name
        );

        setName("");

        loadSubjects();
      } catch (error) {
        console.log(error);
      }
    };

  const handleDelete =
    async (id: number) => {
      try {
        await deleteSubjectRequest(
          id
        );

        loadSubjects();
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    loadSubjects();
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
            Предметы
          </h1>

          <p
            className="
              text-gray-500
              mt-1
            "
          >
            Управление предметами
          </p>
        </div>
      </div>

      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          p-6
          shadow-sm
          mb-8
        "
      >
        <h2
          className="
            text-xl
            font-semibold
            mb-5
          "
        >
          Создать предмет
        </h2>

        <div
          className="
            flex
            gap-4
          "
        >
          <input
            type="text"
            placeholder="Название предмета"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="
              flex-1
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-black
            "
          />

          <button
            onClick={handleCreate}
            className="
              bg-black
              text-white
              px-6
              rounded-xl
              hover:bg-gray-800
              transition
            "
          >
            Создать
          </button>
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
                Название предмета
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
            {subjects.map(
              (subject) => (
                <tr
                  key={subject.id}
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
                    {subject.id}
                  </td>

                  <td
                    className="
                      px-6
                      py-4
                      font-medium
                    "
                  >
                    {subject.name}
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
                          subject.id
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

        {subjects.length ===
          0 && (
          <div
            className="
              p-10
              text-center
              text-gray-500
            "
          >
            Предметы отсутствуют
          </div>
        )}
      </div>
    </MainLayout>
  );
}