import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import groupRoutes from "./routes/groupRoutes";
import studentRoutes from "./routes/studentRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./database/data-source";
import authRoutes from "./routes/authRoutes";
import journalRoutes from "./routes/journal.routes";
import labRoutes from "./routes/labRoutes";
import labSubmissionRoutes from "./routes/labSubmissionRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import path from "path";
dotenv.config();

const app = express();
app.use("/lessons", lessonRoutes);
app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/groups", groupRoutes);
app.use("/students", studentRoutes);
app.use("/subjects", subjectRoutes);
app.use("/auth", authRoutes);
app.use("/journal", journalRoutes);
app.use("/labs", labRoutes);
app.use("/lab-submissions", labSubmissionRoutes);

app.get("/", (_, res) => {
  res.json({
    message: "Server works",
  });
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.listen(5000, () => {
      console.log("Server started on port 5000");
    });
  })
  .catch((error) => {
    console.error("DATABASE ERROR:");
    console.error(error);
  });