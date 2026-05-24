import { Router } from "express";

import { SubjectController } from "../controllers/SubjectController";

import { authMiddleware } from "../middlewares/authMiddleware";

import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  SubjectController.getAll
);

router.get(
  "/:id",
  authMiddleware,
  SubjectController.getOne
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([
    "TEACHER",
    "ADMIN",
  ]),
  SubjectController.create
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware([
    "TEACHER",
    "ADMIN",
  ]),
  SubjectController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([
    "TEACHER",
    "ADMIN",
  ]),
  SubjectController.delete
);

export default router;