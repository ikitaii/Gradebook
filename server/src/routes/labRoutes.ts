import { Router } from "express";
import { upload } from "../config/multer";
import { LabController } from "../controllers/labController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", authMiddleware, LabController.getAll);

router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не загружен" });
    }
    return res.json({
      message: "Файл успешно загружен",
      fileUrl: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка загрузки файла" });
  }
});

router.get(
  "/:id/team-candidates",
  authMiddleware,
  roleMiddleware(["ADMIN", "TEACHER"]),
  LabController.getTeamCandidates
);

router.put(
  "/:id/team",
  authMiddleware,
  roleMiddleware(["ADMIN", "TEACHER"]),
  LabController.upsertTeam
);

router.get("/:id", authMiddleware, LabController.getOne);

export default router;
