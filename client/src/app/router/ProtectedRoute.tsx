import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../entities/auth/useAuth";
import type { UserRole } from "../../entities/auth/auth.types";

interface ProtectedRouteProps {
  children: React.ReactElement; 
  role?: UserRole;
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

 
  if (isLoading) {
    return <div>Loading session...</div>;
  }

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

 
  if (role && user.role !== role) {
    return <div>Access denied</div>;
  }

 
  return children};
