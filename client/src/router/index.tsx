import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";
import HomePage from "./HomePage";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import GroupsPage from "../pages/GroupsPage";
import JournalPage from "../pages/JournalPage";
import SubjectsPage from "../pages/SubjectsPage";
import LabReviewPage from "../pages/LabReviewPage";
import SchedulePage from "../pages/SchedulePage";
import LabsPage from "../pages/LabsPage";
import NotFoundPage from "../pages/NotFoundPage";
import StudentGradesPage from "../pages/StudentGradesPage";
import StudentsPage from "../pages/StudentsPage";
import StudentJournalPage from "../pages/StudentJournalPage";
import StudentSubjectsPage from "../pages/StudentSubjectsPage";
import StudentSubjectDetailPage from "../pages/StudentSubjectDetailPage";
import TeacherProgramPage from "../pages/TeacherProgramPage";
import TeacherProgramDetailPage from "../pages/TeacherProgramDetailPage";
import StudentLabDetailPage from "../pages/StudentLabDetailPage";

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
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

      {/* ADMIN */}
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
        path="/schedule"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["ADMIN", "TEACHER", "STUDENT"]}>
              <SchedulePage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* TEACHER */}
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["TEACHER"]}>
              <JournalPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/subject"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["TEACHER"]}>
              <TeacherProgramPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/subject/:id"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["TEACHER"]}>
              <TeacherProgramDetailPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/lab-review"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["TEACHER"]}>
              <LabReviewPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* STUDENT */}
      <Route
        path="/student-journal"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["STUDENT"]}>
              <StudentJournalPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-subjects"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["STUDENT"]}>
              <StudentSubjectsPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-subjects/:id"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["STUDENT"]}>
              <StudentSubjectDetailPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/labs"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["STUDENT"]}>
              <LabsPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/labs/:id"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["STUDENT"]}>
              <StudentLabDetailPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/:id/grades"
        element={
          <ProtectedRoute>
            <RoleRoute roles={["STUDENT", "TEACHER", "ADMIN"]}>
              <StudentGradesPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
