import { Navigate } from "react-router-dom";

import { useAuth } from "../store/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isAuth,
    loading,
  } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return (
      <Navigate to="/login" />
    );
  }

  return children;
}