import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // <-- ДОБАВИЛИ
import "react-toastify/dist/ReactToastify.css"; // <-- ДОБАВИЛИ СТИЛИ

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CourseListPage from "./pages/CourseListPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import GroupListPage from "./pages/GroupListPage";
import GradebookPage from "./pages/GradebookPage";
import HomeworkPage from "./pages/HomeworkPage";
import { ProtectedRoute } from "./app/router/ProtectedRoute";
import { AuthProvider } from "./entities/auth/auth.store";
import { CourseProvider } from "./entities/course/course.store";
import { GroupProvider } from "./entities/group/group.store";
import { GradeProvider } from "./entities/grade/grade.store";
import { HomeworkProvider } from "./entities/homework/homework.store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <CourseProvider>
        <GroupProvider>
          <GradeProvider>
            <HomeworkProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/courses" element={<ProtectedRoute><CourseListPage /></ProtectedRoute>} />
                  <Route path="/courses/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
                  <Route path="/groups" element={<ProtectedRoute role="TEACHER"><GroupListPage /></ProtectedRoute>} />
                  <Route path="/gradebook" element={<ProtectedRoute><GradebookPage /></ProtectedRoute>} />
                  <Route path="/lesson/:lessonId/homework" element={<ProtectedRoute><HomeworkPage /></ProtectedRoute>} />
                </Routes>
              </BrowserRouter>
              <ToastContainer position="top-right" autoClose={3000} /> {/* <-- ДОБАВИЛИ КОНТЕЙНЕР */}
            </HomeworkProvider>
          </GradeProvider>
        </GroupProvider>
      </CourseProvider>
    </AuthProvider>
  </React.StrictMode>
);
