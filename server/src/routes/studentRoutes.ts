import { Router } from "express";

import { StudentController } from "../controllers/StudentController";

import { authMiddleware } from "../middlewares/authMiddleware";

import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  StudentController.getAll
);

router.get(
  "/:id",
  authMiddleware,
  StudentController.getOne
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([
    "TEACHER",
    "ADMIN",
  ]),
  StudentController.create
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware([
    "TEACHER",
    "ADMIN",
  ]),
  StudentController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([
    "TEACHER",
    "ADMIN",
  ]),
  StudentController.delete
);

export default router;