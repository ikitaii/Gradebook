import { Router } from "express";
import { LabController } from "../controllers/labController";

const router = Router();

router.post("/", LabController.create);
router.get("/", LabController.getAll);

export default router;