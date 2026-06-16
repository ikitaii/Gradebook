import { Router } from "express";
import { SubjectController } from "../controllers/SubjectController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", authMiddleware, SubjectController.getAll);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  SubjectController.create
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  SubjectController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  SubjectController.delete
);

export default router;
