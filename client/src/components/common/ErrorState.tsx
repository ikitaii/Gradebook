export default function ErrorState({
  message,
}: {
  message: string;
}) {
  return (
    <div
      className="
        bg-red-50
        border
        border-red-200
        rounded-2xl
        p-8
        text-center
      "
    >
      <h3
        className="
          text-red-700
          font-semibold
          text-lg
        "
      >
        {message}
      </h3>
    </div>
  );
}
