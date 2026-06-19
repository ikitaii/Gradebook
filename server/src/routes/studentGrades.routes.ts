import { Router } from "express";
import { StudentGradesController } from "../controllers/studentGrades.controller";
import { verifyStudentAccess } from "../middlewares/verifyStudentAccess";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/:id/grades",
  authMiddleware,
  verifyStudentAccess,
  StudentGradesController.getStudentGrades
);

export default router;