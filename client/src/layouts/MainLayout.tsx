import { Link } from "react-router-dom";

import { useAuth } from "../store/AuthContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } =
    useAuth();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <aside
        style={{
          width: "250px",
          background: "#1e1e1e",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Gradebook</h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <Link to="/">
            Dashboard
          </Link>

          <Link to="/groups">
            Groups
          </Link>

          <Link to="/students">
            Students
          </Link>

          <Link to="/subjects">
            Subjects
          </Link>

          <Link to="/journal">
            Journal
          </Link>

          <Link to="/schedule">
            Schedule
          </Link>

          <Link to="/labs">
            Labs
          </Link>
        </nav>
      </aside>

      <div
        style={{
          flex: 1,
        }}
      >
        <header
          style={{
            height: "70px",
            borderBottom:
              "1px solid #ddd",

            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",

            padding: "0 20px",
          }}
        >
          <div>
            {user?.fullName}
          </div>

          <button onClick={logout}>
            Logout
          </button>
        </header>

        <main
          style={{
            padding: "20px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}