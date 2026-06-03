import { Router } from "express";

import { upload } from "../config/multer";

import { AppDataSource } from "../database/data-source";

import { Lab } from "../entities/Lab";

const router = Router();

router.get(
  "/",

  async (_, res) => {
    try {
      const labs =
        await AppDataSource
          .getRepository(Lab)
          .find();

      return res.json(labs);
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка получения лабораторных",
      });
    }
  }
);

router.post(
  "/upload",

  upload.single("file"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            "Файл не загружен",
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      return res.json({
        message:
          "Файл успешно загружен",

        fileUrl,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка загрузки файла",
      });
    }
  }
);

export default router;