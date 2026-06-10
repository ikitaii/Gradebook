import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getLessonsRequest,
  createLessonRequest,
  deleteLessonRequest,
} from "../api/lessons";

type LessonType = {
  id: number;

  lessonDate: string;

  topic: string;

  subject: {
    name: string;
  };

  group: {
    name: string;
  };

  teacher: {
    user: {
      fullName: string;
    };
  };
};

export default function LessonsPage() {
  const [lessons, setLessons] =
    useState<LessonType[]>(
      []
    );

  const [date, setDate] =
    useState("");

  const [groupId, setGroupId] =
    useState("");

  const [subjectId, setSubjectId] =
    useState("");

  const [teacherId, setTeacherId] =
    useState("");

  const loadLessons =
    async () => {
      try {
        const data =
          await getLessonsRequest();

        setLessons(data);
      } catch (error) {
        console.log(error);
      }
    };

  const handleCreate =
    async () => {
      try {
        await createLessonRequest(
          {
            date,

            groupId:
              Number(
                groupId
              ),

            subjectId:
              Number(
                subjectId
              ),

            teacherId:
              Number(
                teacherId
              ),
          }
        );

        setDate("");

        setGroupId("");

        setSubjectId("");

        setTeacherId("");

        loadLessons();
      } catch (error) {
        console.log(error);
      }
    };

  const handleDelete =
    async (
      id: number
    ) => {
      try {
        await deleteLessonRequest(
          id
        );

        loadLessons();
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    loadLessons();
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
          Управление парами
        </h1>

        <p
          className="
            text-gray-500
          "
        >
          Создание и
          управление
          расписанием
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
            xl:grid-cols-4
            gap-4
            mb-5
          "
        >
          <input
            type="datetime-local"
            value={date}
            onChange={(e) =>
              setDate(
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

          <input
            type="number"
            placeholder="ID группы"
            value={groupId}
            onChange={(e) =>
              setGroupId(
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

          <input
            type="number"
            placeholder="ID предмета"
            value={subjectId}
            onChange={(e) =>
              setSubjectId(
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

          <input
            type="number"
            placeholder="ID преподавателя"
            value={teacherId}
            onChange={(e) =>
              setTeacherId(
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
          Создать пару
        </button>
      </div>

      <div
        className="
          flex
          flex-col
          gap-5
        "
      >
        {lessons.map(
          (lesson) => (
            <div
              key={lesson.id}
              className="
                bg-white
                border
                border-gray-200
                rounded-3xl
                p-6
                shadow-sm
                flex
                justify-between
                items-center
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
                  {
                    lesson.subject
                      .name
                  }
                </div>

                <div
                  className="
                    text-gray-500
                    mb-1
                  "
                >
                  Группа:{" "}
                  {
                    lesson
                      .group
                      .name
                  }
                </div>

                <div
                  className="
                    text-gray-500
                    mb-1
                  "
                >
                  Преподаватель:{" "}
                  {
                    lesson
                      .teacher
                      .user
                      .fullName
                  }
                </div>

                <div
                  className="
                    text-gray-500
                  "
                >
                  {new Date(
                    lesson.lessonDate
                  ).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() =>
                  handleDelete(
                    lesson.id
                  )
                }
                className="
                  bg-red-500
                  text-white
                  px-5
                  py-3
                  rounded-xl
                  hover:bg-red-600
                  transition
                "
              >
                Удалить
              </button>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}