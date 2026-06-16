import { Router } from "express";
import { StudentGradesController } from "../controllers/studentGrades.controller";
import { verifyStudentAccess } from "../middlewares/verifyStudentAccess";

const router = Router();

router.get("/:id/grades", verifyStudentAccess, StudentGradesController.getStudentGrades);

export default router;