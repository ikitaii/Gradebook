import MainLayout from "../layouts/MainLayout";

const days = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
];

export default function SchedulePage() {
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
          Расписание
        </h1>

        <p
          className="
            text-gray-500
          "
        >
          Учебное расписание групп
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
        {days.map((day) => (
          <div
            key={day}
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-6
              shadow-sm
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
                mb-5
              "
            >
              {day}
            </h2>

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
                "
              >
                <div
                  className="
                    font-semibold
                    mb-1
                  "
                >
                  Программирование
                </div>

                <div
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  08:30 — 10:00
                </div>
              </div>

              <div
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-4
                "
              >
                <div
                  className="
                    font-semibold
                    mb-1
                  "
                >
                  Базы данных
                </div>

                <div
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  10:15 — 11:45
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}