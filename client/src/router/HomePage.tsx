import { Navigate } from "react-router-dom";
import { useAuth } from "../entities/auth/auth.store";
import DashboardPage from "../pages/DashboardPage";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8 text-xl font-bold">Загрузка...</div>;
  }

  if (user?.role === "ADMIN") {
    return <Navigate to="/groups" replace />;
  }

  return <DashboardPage />;
}
