import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import GroupsPage from "../pages/GroupsPage";
import LoginPage from "../pages/LoginPage";
import StudentsPage from "../pages/StudentPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import SubjectsPage from "../pages/SubjectsPage";
import NotFoundPage from "../pages/NotFoundPage";
import JournalPage from "../pages/JournalPage";
import LessonsPage from "../pages/LessonsPage";
import SchedulePage from "../pages/SchedulePage";
import LabsPage from "../pages/LabsPage";
import LabReviewPage from "../pages/LabReviewPage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

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
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["ADMIN"]}>
                <GroupsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <RoleRoute
                roles={[
                  "ADMIN",
                  "TEACHER",
                  "STUDENT",
                ]}
              >
                <JournalPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["ADMIN"]}>
                <SubjectsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
  path="/lab-review"
  element={
    <ProtectedRoute>
      <LabReviewPage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <RoleRoute
                roles={[
                  "ADMIN",
                  "TEACHER",
                ]}
              >
                <LessonsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <SchedulePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/labs"
          element={
            <ProtectedRoute>
              <LabsPage />
            </ProtectedRoute>
          }
        />

        

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["ADMIN"]}>
                <StudentsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}