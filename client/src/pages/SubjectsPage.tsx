import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getProgramRequest,
  createProgramRequest,
} from "../api/program";

type ProgramItemType = {
  id: number;

  title: string;

  description: string;

  type: string;

  materialUrl: string;

  deadline: string;

  teamWork: boolean;
};

export default function SubjectPage() {
  const [items, setItems] =
    useState<
      ProgramItemType[]
    >([]);

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [type, setType] =
    useState("LAB");

  const [
    materialUrl,
    setMaterialUrl,
  ] = useState("");

  const [
    deadline,
    setDeadline,
  ] = useState("");

  const [
    teamWork,
    setTeamWork,
  ] = useState(false);

  const loadProgram =
    async () => {
      try {
        const data =
          await getProgramRequest(
            1
          );

        setItems(data);
      } catch (error) {
        console.log(error);
      }
    };

  const handleCreate =
    async () => {
      try {
        await createProgramRequest(
          {
            subjectId: 1,

            title,

            description,

            type,

            materialUrl,

            deadline,

            teamWork,
          }
        );

        setTitle("");

        setDescription("");

        setMaterialUrl("");

        setDeadline("");

        setTeamWork(false);

        loadProgram();
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    loadProgram();
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
          Программа предмета
        </h1>

        <p
          className="
            text-gray-500
          "
        >
          Управление
          лабораторными,
          теорией и
          дедлайнами
        </p>
      </div>

      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-3xl
          p-6
          shadow-sm
          mb-8
        "
      >
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
            mb-4
          "
        >
          <input
            type="text"
            placeholder="Название"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-black
            "
          />

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value
              )
            }
            className="
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-black
            "
          >
            <option value="LAB">
              Лабораторная
            </option>

            <option value="THEORY">
              Теория
            </option>

            <option value="PRACTICE">
              Практика
            </option>

            <option value="TEST">
              Тест
            </option>
          </select>

          <textarea
            placeholder="Описание"
            value={
              description
            }
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            className="
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-black
              min-h-[120px]
            "
          />

          <div
            className="
              flex
              flex-col
              gap-4
            "
          >
            <input
              type="text"
              placeholder="Ссылка на материалы"
              value={
                materialUrl
              }
              onChange={(e) =>
                setMaterialUrl(
                  e.target
                    .value
                )
              }
              className="
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-black
              "
            />

            <input
              type="datetime-local"
              value={
                deadline
              }
              onChange={(e) =>
                setDeadline(
                  e.target
                    .value
                )
              }
              className="
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-black
              "
            />

            <label
              className="
                flex
                items-center
                gap-3
              "
            >
              <input
                type="checkbox"
                checked={
                  teamWork
                }
                onChange={(
                  e
                ) =>
                  setTeamWork(
                    e.target
                      .checked
                  )
                }
              />

              Командная работа
            </label>
          </div>
        </div>

        <button
          onClick={
            handleCreate
          }
          className="
            bg-black
            text-white
            px-6
            py-3
            rounded-xl
            hover:opacity-90
            transition
          "
        >
          Создать элемент
        </button>
      </div>

      <div
        className="
          flex
          flex-col
          gap-5
        "
      >
        {items.map(
          (item) => (
            <div
              key={item.id}
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
                  justify-between
                  items-start
                  mb-4
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
                    {item.title}
                  </div>

                  <div
                    className="
                      text-gray-500
                    "
                  >
                    {item.type}
                  </div>
                </div>

                {item.teamWork && (
                  <div
                    className="
                      bg-blue-100
                      text-blue-700
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-medium
                    "
                  >
                    Командная
                  </div>
                )}
              </div>

              <div
                className="
                  text-gray-700
                  mb-5
                "
              >
                {
                  item.description
                }
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  gap-6
                  text-sm
                "
              >
                <div>
                  <span
                    className="
                      font-semibold
                    "
                  >
                    Дедлайн:
                  </span>{" "}
                  {item.deadline
                    ? new Date(
                        item.deadline
                      ).toLocaleString()
                    : "Нет"}
                </div>

                <div>
                  <span
                    className="
                      font-semibold
                    "
                  >
                    Материалы:
                  </span>{" "}
                  {item.materialUrl ? (
                    <a
                      href={
                        item.materialUrl
                      }
                      target="_blank"
                      className="
                        text-blue-600
                      "
                    >
                      Открыть
                    </a>
                  ) : (
                    "Нет"
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}