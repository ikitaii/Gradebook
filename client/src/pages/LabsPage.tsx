import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";
import {
  uploadLabRequest,
  getLabsRequest,
} from "../api/labs";

type LabType = {
  id: number;

  title: string;

  subject: string;

  deadline: string;

  status:
    | "PENDING"
    | "SUBMITTED"
    | "CHECKED";

  grade?: number;
};

export default function LabsPage() {
  const [labs, setLabs] =
    useState<LabType[]>([]);

  const [
    selectedFiles,
    setSelectedFiles,
  ] = useState<
    Record<number, File | null>
  >({});
const loadLabs =
  async () => {
    try {
      const data =
        await getLabsRequest();

      setLabs(data);
    } catch (error) {
      console.log(error);
    }
  };
  
useEffect(() => {
  loadLabs();
}, []);
  const getStatus = (
    status: string
  ) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Не сдано",

          className:
            "bg-red-100 text-red-700",
        };

      case "SUBMITTED":
        return {
          text: "На проверке",

          className:
            "bg-yellow-100 text-yellow-700",
        };

      case "CHECKED":
        return {
          text: "Проверено",

          className:
            "bg-green-100 text-green-700",
        };

      default:
        return {
          text: "Неизвестно",

          className:
            "bg-gray-100 text-gray-700",
        };
    }
  };

  const handleUpload =
    async (labId: number) => {
      const file =
        selectedFiles[labId];

      if (!file) return;

      try {
        await uploadLabRequest(
          labId,
          file
        );

        toast.success(
        "Файл успешно загружен"
        );
      } catch (error) {
        toast.error(
         "Ошибка загрузки файла"
);
      }
    };

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
          Лабораторные работы
        </h1>

        <p
          className="
            text-gray-500
          "
        >
          Загрузка и проверка
          лабораторных работ
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >
        {labs.map((lab) => {
          const status =
            getStatus(lab.status);

          return (
            <div
              key={lab.id}
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
                  items-start
                  justify-between
                  mb-5
                "
              >
                <div>
                  <h2
                    className="
                      text-xl
                      font-semibold
                      mb-2
                    "
                  >
                    {lab.title}
                  </h2>

                  <div
                    className="
                      text-gray-500
                    "
                  >
                    {lab.subject}
                  </div>
                </div>

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                    ${status.className}
                  `}
                >
                  {status.text}
                </span>
              </div>

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  text-gray-700
                  mb-6
                "
              >
                <div>
                  <span className="font-semibold">
                    Дедлайн:
                  </span>{" "}
                  {lab.deadline}
                </div>

                {lab.grade && (
                  <div>
                    <span className="font-semibold">
                      Оценка:
                    </span>{" "}
                    {lab.grade}
                  </div>
                )}
              </div>

              <div
                className="
                  flex
                  flex-col
                  gap-4
                "
              >
                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedFiles({
                      ...selectedFiles,

                      [lab.id]:
                        e.target
                          .files?.[0] ||
                        null,
                    })
                  }
                  className="
                    border
                    border-gray-300
                    rounded-xl
                    p-3
                    bg-gray-50
                  "
                />

                {selectedFiles[
                  lab.id
                ] && (
                  <div
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    Выбран файл:
                    {" "}
                    {
                      selectedFiles[
                        lab.id
                      ]?.name
                    }
                  </div>
                )}

                <div
                  className="
                    flex
                    gap-3
                  "
                >
                  <button
                    onClick={() =>
                      handleUpload(
                        lab.id
                      )
                    }
                    className="
                      bg-black
                      text-white
                      px-5
                      py-3
                      rounded-xl
                      hover:bg-gray-800
                      transition
                    "
                  >
                    Загрузить
                  </button>

                  <button
                    className="
                      border
                      border-gray-300
                      px-5
                      py-3
                      rounded-xl
                      hover:bg-gray-100
                      transition
                    "
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {labs.length === 0 && (
        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            p-10
            text-center
            text-gray-500
          "
        >
          Лабораторные работы
          отсутствуют
        </div>
      )}
    </MainLayout>
  );
}