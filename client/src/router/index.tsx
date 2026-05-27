import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import GroupsPage from "../pages/GroupsPage";
import LoginPage from "../pages/LoginPage";

import RegisterPage from "../pages/RegisterPage";

import DashboardPage from "../pages/DashboardPage";

import NotFoundPage from "../pages/NotFoundPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
        <Route
            path="/groups"
            element={
            <ProtectedRoute>
            <GroupsPage />
        </ProtectedRoute>
         }
/>
      </Routes>
    </BrowserRouter>
  );
}