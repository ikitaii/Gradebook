import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

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
              <Toaster position="top-right" />
              <App />
            </HomeworkProvider>
          </GradeProvider>
        </GroupProvider>
      </CourseProvider>
    </AuthProvider>
  </React.StrictMode>
);
