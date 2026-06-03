import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getGroupsRequest,
  createGroupRequest,
  deleteGroupRequest,
} from "../api/groups";

type GroupType = {
  id: number;
  name: string;
};

export default function GroupsPage() {
  const [groups, setGroups] =
    useState<GroupType[]>([]);

  const [name, setName] =
    useState("");

  const loadGroups = async () => {
    try {
      const data =
        await getGroupsRequest();

      setGroups(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate =
    async () => {
      try {
        if (!name.trim()) return;

        await createGroupRequest(
          name
        );

        setName("");

        loadGroups();
      } catch (error) {
        console.log(error);
      }
    };

  const handleDelete =
    async (id: number) => {
      try {
        await deleteGroupRequest(id);

        loadGroups();
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    loadGroups();
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
            Группы
          </h1>

          <p
            className="
              text-gray-500
              mt-1
            "
          >
            Управление
            учебными группами
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
          Создать группу
        </h2>

        <div
          className="
            flex
            gap-4
          "
        >
          <input
            type="text"
            placeholder="Название группы"
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
                Название группы
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
            {groups.map((group) => (
              <tr
                key={group.id}
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
                  {group.id}
                </td>

                <td
                  className="
                    px-6
                    py-4
                    font-medium
                  "
                >
                  {group.name}
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
                        group.id
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
            ))}
          </tbody>
        </table>

        {groups.length === 0 && (
          <div
            className="
              p-10
              text-center
              text-gray-500
            "
          >
            Группы отсутствуют
          </div>
        )}
      </div>
    </MainLayout>
  );
}