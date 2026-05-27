import MainLayout from "../layouts/MainLayout";

import {
  Users,
  BookOpen,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Студенты",
      value: "128",
      icon: Users,
    },

    {
      title: "Группы",
      value: "12",
      icon: GraduationCap,
    },

    {
      title: "Предметы",
      value: "18",
      icon: BookOpen,
    },

    {
      title: "Пары",
      value: "54",
      icon: CalendarDays,
    },
  ];

  const actions = [
    "Создать группу",
    "Открыть журнал",
    "Добавить пару",
    "Управление предметами",
  ];

  return (
    <MainLayout>
      <div className="mb-10">
        <h1
          className="
            text-4xl
            font-bold
            mb-2
          "
        >
          Главная панель
        </h1>

        <p
          className="
            text-gray-500
            text-lg
          "
        >
          Добро пожаловать в систему
          электронного журнала
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          mb-10
        "
      >
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                p-6
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >
                <div
                  className="
                    text-gray-500
                    text-sm
                    font-medium
                  "
                >
                  {item.title}
                </div>

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-gray-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Icon size={22} />
                </div>
              </div>

              <div
                className="
                  text-5xl
                  font-bold
                "
              >
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >
        <div
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
              items-center
              justify-between
              mb-6
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
              "
            >
              Быстрые действия
            </h2>

            <span
              className="
                text-sm
                text-gray-400
              "
            >
              Actions
            </span>
          </div>

          <div
            className="
              flex
              flex-col
              gap-4
            "
          >
            {actions.map(
              (action) => (
                <button
                  key={action}
                  className="
                    text-left
                    border
                    border-gray-200
                    rounded-2xl
                    px-5
                    py-4
                    hover:bg-gray-50
                    hover:border-gray-300
                    transition
                    font-medium
                  "
                >
                  {action}
                </button>
              )
            )}
          </div>
        </div>

        <div
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
              items-center
              justify-between
              mb-6
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
              "
            >
              Последняя активность
            </h2>

            <span
              className="
                text-sm
                text-gray-400
              "
            >
              Activity
            </span>
          </div>

          <div
            className="
              flex
              flex-col
              gap-4
            "
          >
            <div
              className="
                border
                border-gray-200
                rounded-2xl
                p-4
                hover:bg-gray-50
                transition
              "
            >
              <div
                className="
                  font-medium
                  mb-1
                "
              >
                Добавлена новая группа
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                "
              >
                ИС-21
              </div>
            </div>

            <div
              className="
                border
                border-gray-200
                rounded-2xl
                p-4
                hover:bg-gray-50
                transition
              "
            >
              <div
                className="
                  font-medium
                  mb-1
                "
              >
                Обновлены оценки
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                "
              >
                Предмет: Математика
              </div>
            </div>

            <div
              className="
                border
                border-gray-200
                rounded-2xl
                p-4
                hover:bg-gray-50
                transition
              "
            >
              <div
                className="
                  font-medium
                  mb-1
                "
              >
                Создана новая пара
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                "
              >
                Программирование
              </div>
            </div>

            <div
              className="
                border
                border-gray-200
                rounded-2xl
                p-4
                hover:bg-gray-50
                transition
              "
            >
              <div
                className="
                  font-medium
                  mb-1
                "
              >
                Добавлена лабораторная
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                "
              >
                Базы данных
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}