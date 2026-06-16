import { Router } from "express";
import { TeacherController } from "../controllers/TeacherController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  roleMiddleware(["TEACHER"]),
  TeacherController.getMe
);

router.get("/", authMiddleware, roleMiddleware(["ADMIN", "TEACHER"]), TeacherController.get);

export default router;
