import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      style={{
        height: "100vh",

        display: "flex",

        flexDirection: "column",

        justifyContent: "center",

        alignItems: "center",

        gap: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "64px",
        }}
      >
        404
      </h1>

      <p>
        Page not found
      </p>

      <Link to="/">
        Go to Dashboard
      </Link>
    </div>
  );
}