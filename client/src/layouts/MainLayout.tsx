import {
  Link,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../store/AuthContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } =
    useAuth();

  const location =
    useLocation();

  const navItems =
  user?.role === "ADMIN"
    ? [
        {
          path: "/",
          label: "Главная",
        },

        {
          path: "/groups",
          label: "Группы",
        },

        {
          path: "/students",
          label: "Студенты",
        },

        {
          path: "/subjects",
          label: "Предметы",
        },

        {
          path: "/journal",
          label: "Журнал",
        },

        {
          path: "/lessons",
          label: "Пары",
        },

        {
          path: "/schedule",
          label: "Расписание",
        },

        {
          path: "/labs",
          label: "Лабораторные",
        },
      ]

    : user?.role ===
      "TEACHER"

    ? [
        {
          path: "/",
          label: "Главная",
        },

        {
          path: "/journal",
          label: "Журнал",
        },

        {
          path: "/lessons",
          label: "Пары",
        },

        {
          path: "/labs",
          label: "Лабораторные",
        },
      ]

    : [
        {
          path: "/",
          label: "Главная",
        },

        {
          path: "/journal",
          label: "Мои оценки",
        },

        {
          path: "/labs",
          label: "Лабораторные",
        },
      ];

  return (
    <div
      className="
        flex
        min-h-screen
        bg-gray-100
      "
    >
      <aside
        className="
          w-[260px]
          bg-white
          border-r
          border-gray-200
          p-6
          flex
          flex-col
        "
      >
        <h2
          className="
            text-3xl
            font-bold
            mb-10
          "
        >
          Gradebook
        </h2>

        <nav
          className="
            flex
            flex-col
            gap-2
          "
        >
          {navItems.map(
            (item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-4
                  py-3
                  rounded-xl
                  transition
                  font-medium
                  ${
                    location.pathname ===
                    item.path
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="mt-auto">
          <div
            className="
              border-t
              border-gray-200
              pt-5
            "
          >
            <div
              className="
                text-sm
                text-gray-500
                mb-2
              "
            >
              Пользователь
            </div>

            <div
              className="
                font-semibold
                mb-4
              "
            >
              {user?.fullName}
            </div>

            <button
              onClick={logout}
              className="
                w-full
                bg-red-500
                text-white
                py-3
                rounded-xl
                hover:bg-red-600
                transition
              "
            >
              Выйти
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <header
          className="
            h-[80px]
            bg-white
            border-b
            border-gray-200
            flex
            items-center
            justify-between
            px-8
          "
        >
          <div>
            <h1
              className="
                text-2xl
                font-bold
              "
            >
              Электронный журнал
            </h1>
          </div>

          <div
            className="
              text-gray-600
            "
          >
            {
              user?.role
            }
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}