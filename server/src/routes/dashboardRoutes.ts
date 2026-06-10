import { Router } from "express";

import { DashboardController } from "../controllers/dashboard.controller";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/",

  authMiddleware,

  DashboardController.get
);

export default router;