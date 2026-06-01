export default function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
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
      <h3>{message}</h3>
    </div>
  );
}