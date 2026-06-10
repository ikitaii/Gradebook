import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  checkLabRequest,
} from "../api/labs";

import api from "../api";

type SubmissionType = {
  id: number;

  fileUrl: string;

  comment: string;

  grade: number;

  checked: boolean;

  createdAt: string;

  student: {
    id: number;

    user: {
      fullName: string;
    };
  };

  lab: {
    id: number;

    title: string;

    deadline: string;
  };
};

export default function LabReviewPage() {
  const [
    submissions,
    setSubmissions,
  ] = useState<
    SubmissionType[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const loadSubmissions =
    async () => {
      try {
        const response =
          await api.get(
            "/lab-submissions"
          );

        setSubmissions(
          response.data
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const reviewSubmission =
    async (
      submissionId: number
    ) => {
      const grade =
        prompt(
          "Введите оценку"
        );

      if (!grade) {
        return;
      }

      const comment =
        prompt(
          "Введите комментарий"
        ) || "";

      try {
        await checkLabRequest(
          submissionId,

          Number(grade),

          comment
        );

        loadSubmissions();
      } catch (error) {
        console.log(error);
      }
    };

  if (loading) {
    return (
      <MainLayout>
        <div
          className="
            text-2xl
            font-bold
          "
        >
          Загрузка...
        </div>
      </MainLayout>
    );
  }

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
          Проверка
          лабораторных
        </h1>

        <p
          className="
            text-gray-500
          "
        >
          Проверка
          загруженных работ
        </p>
      </div>

      <div
        className="
          flex
          flex-col
          gap-6
        "
      >
        {submissions.map(
          (
            submission
          ) => {
            const isLate =
              new Date(
                submission.createdAt
              ) >
              new Date(
                submission.lab.deadline
              );

            return (
              <div
                key={
                  submission.id
                }
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
                    gap-6
                    flex-wrap
                  "
                >
                  <div>
                    <div
                      className="
                        text-2xl
                        font-bold
                        mb-3
                      "
                    >
                      {
                        submission
                          .lab
                          .title
                      }
                    </div>

                    <div
                      className="
                        text-gray-500
                        mb-2
                      "
                    >
                      Студент:
                      {" "}
                      {
                        submission
                          .student
                          .user
                          .fullName
                      }
                    </div>

                    <div
                      className="
                        text-gray-500
                        mb-2
                      "
                    >
                      Загружено:
                      {" "}
                      {new Date(
                        submission.createdAt
                      ).toLocaleString()}
                    </div>

                    <div
                      className="
                        text-gray-500
                      "
                    >
                      Дедлайн:
                      {" "}
                      {new Date(
                        submission
                          .lab
                          .deadline
                      ).toLocaleString()}
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      gap-3
                      flex-wrap
                    "
                  >
                    {submission.checked ? (
                      <div
                        className="
                          bg-green-100
                          text-green-700
                          px-4
                          py-2
                          rounded-full
                          font-semibold
                        "
                      >
                        Проверено
                      </div>
                    ) : (
                      <div
                        className="
                          bg-yellow-100
                          text-yellow-700
                          px-4
                          py-2
                          rounded-full
                          font-semibold
                        "
                      >
                        Ожидает
                      </div>
                    )}

                    {isLate && (
                      <div
                        className="
                          bg-red-100
                          text-red-700
                          px-4
                          py-2
                          rounded-full
                          font-semibold
                        "
                      >
                        Просрочено
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="
                    mt-6
                    flex
                    gap-4
                    flex-wrap
                  "
                >
                  <a
                    href={`http://localhost:5000${submission.fileUrl}`}
                    target="_blank"
                    className="
                      bg-black
                      text-white
                      px-6
                      py-3
                      rounded-2xl
                      font-semibold
                    "
                  >
                    Открыть файл
                  </a>

                  <button
                    onClick={() =>
                      reviewSubmission(
                        submission.id
                      )
                    }
                    className="
                      bg-blue-600
                      text-white
                      px-6
                      py-3
                      rounded-2xl
                      font-semibold
                    "
                  >
                    Проверить
                  </button>
                </div>

                {submission.checked && (
                  <div
                    className="
                      mt-8
                      border-t
                      border-gray-200
                      pt-6
                    "
                  >
                    <div
                      className="
                        flex
                        gap-4
                        items-center
                        mb-4
                      "
                    >
                      <div
                        className="
                          w-16
                          h-16
                          rounded-full
                          bg-black
                          text-white
                          flex
                          items-center
                          justify-center
                          text-2xl
                          font-black
                        "
                      >
                        {
                          submission.grade
                        }
                      </div>

                      <div
                        className="
                          text-gray-500
                        "
                      >
                        Оценка
                      </div>
                    </div>

                    <div
                      className="
                        bg-gray-100
                        rounded-2xl
                        p-5
                      "
                    >
                      {
                        submission.comment
                      }
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </MainLayout>
  );
}