import { Navigate } from "react-router-dom";

import { useAuth } from "../store/AuthContext";

export default function RoleRoute({
  children,
  roles,
}: {
  children: React.ReactNode;

  roles: string[];
}) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Navigate to="/login" />
    );
  }

  if (
    !roles.includes(
      user.role
    )
  ) {
    return <Navigate to="/" />;
  }

  return children;
}