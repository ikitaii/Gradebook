import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  X,
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Users,
  GraduationCap,
  ClipboardList,
  FlaskConical,
  FileCheck,
  LogOut,
  BookMarked,
} from "lucide-react";

import {
  useState,
} from "react";

import { useAuth } from "../entities/auth/auth.store";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } =
    useAuth();

  const location =
    useLocation();

  const [open, setOpen] =
    useState(false);

  const roleLabel =
    user?.role === "ADMIN"
      ? "Администратор"
      : user?.role ===
        "TEACHER"
      ? "Преподаватель"
      : "Студент";

  const navItems =
    user?.role === "ADMIN"
      ? [
          {
            path: "/groups",
            label: "Группы",
            icon: Users,
          },
          {
            path: "/students",
            label: "Студенты",
            icon: GraduationCap,
          },
          {
            path: "/subjects",
            label: "Предметы",
            icon: BookOpen,
          },
          {
            path: "/schedule",
            label: "Расписание",
            icon: CalendarDays,
          },
        ]

      : user?.role ===
        "TEACHER"
      ? [
          {
            path: "/",
            label: "Главная",
            icon: LayoutDashboard,
          },
          {
            path: "/journal",
            label: "Журнал",
            icon: ClipboardList,
          },
          {
            path: "/subject",
            label: "Программа",
            icon: BookMarked,
          },
          {
            path: "/schedule",
            label: "Расписание",
            icon: CalendarDays,
          },
          {
            path: "/lab-review",
            label: "Сдача работ",
            icon: FileCheck,
          },
        ]

      : [
          {
            path: "/",
            label: "Главная",
            icon: LayoutDashboard,
          },
          {
            path: "/student-journal",
            label: "Журнал",
            icon: ClipboardList,
          },
          {
            path: "/student-subjects",
            label: "Предметы",
            icon: BookOpen,
          },
          {
            path: "/schedule",
            label: "Расписание",
            icon: CalendarDays,
          },
          {
            path: "/labs",
            label: "Лабораторные",
            icon: FlaskConical,
          },
        ];

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        flex
      "
    >
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          fixed
          top-5
          left-5
          z-50
          xl:hidden
          bg-black
          text-white
          p-3
          rounded-xl
        "
      >
        {open ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      <aside
        className={`
          fixed
          xl:static
          z-40
          top-0
          left-0
          h-screen
          w-[290px]
          bg-white
          border-r
          border-gray-200
          flex
          flex-col
          transition-transform
          duration-300

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full xl:translate-x-0"
          }
        `}
      >
        <div
          className="
            h-[90px]
            flex
            items-center
            px-8
            border-b
            border-gray-200
          "
        >
          <h1
            className="
              text-4xl
              font-black
            "
          >
            Gradebook
          </h1>
        </div>

        <div
          className="
            flex-1
            overflow-y-auto
            p-5
          "
        >
          <nav
            className="
              flex
              flex-col
              gap-2
            "
          >
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === "/"
                    ? location.pathname === "/"
                    : location.pathname === item.path ||
                      location.pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`
                      flex
                      items-center
                      gap-4
                      px-5
                      py-4
                      rounded-2xl
                      transition
                      font-medium

                      ${
                        isActive
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <Icon size={22} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </nav>
        </div>

        <div
          className="
            border-t
            border-gray-200
            p-5
          "
        >
          <div
            className="
              mb-5
            "
          >
            <div
              className="
                text-sm
                text-gray-500
                mb-1
              "
            >
              Пользователь
            </div>

            <div
              className="
                font-bold
                text-lg
              "
            >
              {
                user?.fullName
              }
            </div>

            <div
              className="
                text-gray-500
                text-sm
                mt-1
              "
            >
              {roleLabel}
            </div>
          </div>

          <button
            onClick={
              logout
            }
            className="
              w-full
              bg-red-500
              hover:bg-red-600
              text-white
              py-4
              rounded-2xl
              transition
              flex
              items-center
              justify-center
              gap-3
              font-medium
            "
          >
            <LogOut
              size={20}
            />
            Выйти
          </button>
        </div>
      </aside>

      <div
        className="
          flex-1
          flex
          flex-col
          min-w-0
        "
      >
        <header
          className="
            h-[90px]
            bg-white
            border-b
            border-gray-200
            px-8
            flex
            items-center
            justify-between
            sticky
            top-0
            z-30
          "
        >
          <div>
            <h2
              className="
                text-3xl
                font-bold
              "
            >
              Электронный
              журнал
            </h2>
          </div>

          <div
            className="
              hidden
              md:flex
              items-center
              gap-3
            "
          >
            <div
              className="
                w-12
                h-12
                rounded-full
                bg-black
                text-white
                flex
                items-center
                justify-center
                font-bold
                text-lg
              "
            >
              {user?.fullName?.[0]}
            </div>

            <div>
              <div
                className="
                  font-semibold
                "
              >
                {
                  user?.fullName
                }
              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                "
              >
                {roleLabel}
              </div>
            </div>
          </div>
        </header>

        <main
          className="
            flex-1
            p-4
            md:p-8
            overflow-x-hidden
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}