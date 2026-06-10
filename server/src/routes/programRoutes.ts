import { Router } from "express";

import { ProgramController } from "../controllers/program.controller";

import { authMiddleware } from "../middlewares/authMiddleware";

import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get(
  "/:subjectId",
  authMiddleware,
  ProgramController.get
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([
    "ADMIN",
    "TEACHER",
  ]),
  ProgramController.create
);

export default router;