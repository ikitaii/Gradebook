import { useAuth } from "../entities/auth/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Role: {user?.role}</p>
    </div>
  );
}