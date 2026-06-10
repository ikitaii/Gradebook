import { Navigate } from "react-router-dom";
import { useAuth } from "../entities/auth/useAuth";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}