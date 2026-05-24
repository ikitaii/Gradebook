import { Router } from "express";
import { JournalController } from "../controllers/journal.controller";

const router = Router();
router.get("/", JournalController.get);
router.post("/lesson", JournalController.createLesson);
router.post("/grade", JournalController.setGrade);
router.post("/attendance", JournalController.setAttendance);
export default router;