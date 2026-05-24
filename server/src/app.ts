import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { AppDataSource } from "./database/data-source";
import authRoutes from "./routes/authRoutes";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
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