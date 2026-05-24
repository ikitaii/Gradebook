import { Router } from "express";
import { LabSubmissionController } from "../controllers/LabSubmissionController";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.post("/", upload.single("file"), LabSubmissionController.submit);
router.get("/", LabSubmissionController.getAll);
router.patch("/:id", LabSubmissionController.check);
export default router;