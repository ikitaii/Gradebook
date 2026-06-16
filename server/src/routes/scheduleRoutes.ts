import { Router } from "express";
import { ScheduleController } from "../controllers/ScheduleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", authMiddleware, ScheduleController.getAll);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  ScheduleController.create
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  ScheduleController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  ScheduleController.delete
);

export default router;
