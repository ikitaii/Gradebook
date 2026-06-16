import { Router } from "express";

import { StudentController } from "../controllers/StudentController";
import { StudentGradesController } from "../controllers/studentGrades.controller";
import { verifyStudentAccess } from "../middlewares/verifyStudentAccess";

import { authMiddleware } from "../middlewares/authMiddleware";

import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  StudentController.getAll
);

router.get(
  "/me",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  StudentController.getMe
);

router.get(
  "/me/subjects",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  StudentController.getMySubjects
);

router.get(
  "/:id/grades",
  authMiddleware,
  verifyStudentAccess,
  StudentGradesController.getStudentGrades
);

router.get(
  "/:id",
  authMiddleware,
  StudentController.getOne
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  StudentController.create
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  StudentController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  StudentController.delete
);

export default router;