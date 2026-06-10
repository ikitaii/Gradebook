import { Router } from "express";

import { AppDataSource } from "../database/data-source";

import { Subject } from "../entities/Subject";

const router = Router();

router.get(
  "/",

  async (_, res) => {
    try {
      const subjects =
        await AppDataSource
          .getRepository(
            Subject
          )
          .find({
            order: {
              name: "ASC",
            },
          });

      return res.json(
        subjects
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка получения предметов",
      });
    }
  }
);

export default router;