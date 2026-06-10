import { Router } from "express";

import { AppDataSource } from "../database/data-source";

import { Group } from "../entities/Group";

const router = Router();

router.get(
  "/",

  async (_, res) => {
    try {
      const groups =
        await AppDataSource
          .getRepository(Group)
          .find({
            order: {
              name: "ASC",
            },
          });

      return res.json(
        groups
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка получения групп",
      });
    }
  }
);

export default router;