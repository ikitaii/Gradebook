import { Router } from "express";
import { JournalController } from "../controllers/journal.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get(
  "/assignments",
  authMiddleware,
  roleMiddleware(["TEACHER"]),
  JournalController.getAssignments
);

router.get("/", authMiddleware, JournalController.get);

router.post(
  "/lesson",
  authMiddleware,
  roleMiddleware(["TEACHER"]),
  JournalController.addLesson
);

router.post(
  "/grade",
  authMiddleware,
  roleMiddleware(["TEACHER"]),
  JournalController.setGrade
);

router.post(
  "/attendance",
  authMiddleware,
  roleMiddleware(["TEACHER"]),
  JournalController.setAttendance
);

export default router;
