import { Navigate } from "react-router-dom";

import { useAuth } from "../store/AuthContext";

export default function PublicRoute({
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

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return children;
}