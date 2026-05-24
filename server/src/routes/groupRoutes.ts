import { Router } from "express";

import { GroupController } from "../controllers/GroupController";

import { authMiddleware } from "../middlewares/authMiddleware";

import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  GroupController.getAll
);

router.get(
  "/:id",
  authMiddleware,
  GroupController.getOne
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([
    "TEACHER",
    "ADMIN",
  ]),
  GroupController.create
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware([
    "TEACHER",
    "ADMIN",
  ]),
  GroupController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([
    "TEACHER",
    "ADMIN",
  ]),
  GroupController.delete
);

export default router;