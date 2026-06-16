import { Router } from "express";
import { LabSubmissionController } from "../controllers/LabSubmissionController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get(
  "/my",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  LabSubmissionController.getMy
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "TEACHER"]),
  LabSubmissionController.getAll
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["STUDENT"]),
  LabSubmissionController.submit
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "TEACHER"]),
  LabSubmissionController.review
);

export default router;
