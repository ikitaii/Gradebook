import { Router } from "express";

import { AppDataSource } from "../database/data-source";

import { Lesson } from "../entities/Lesson";

import { Group } from "../entities/Group";

import { Subject } from "../entities/Subject";

import { Teacher } from "../entities/Teacher";

import { authMiddleware } from "../middlewares/authMiddleware";

import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get(
  "/",

  authMiddleware,

  async (_, res) => {
    try {
      const lessons =
        await AppDataSource
          .getRepository(Lesson)
          .find({
            relations: {
              subject: true,

              group: true,

              teacher: {
                user: true,
              },
            },

            order: {
              lessonDate:
                "ASC",
            },
          });

      return res.json(
        lessons
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка получения пар",
      });
    }
  }
);

router.post(
  "/",

  authMiddleware,

  roleMiddleware([
    "ADMIN",
    "TEACHER",
  ]),

  async (req, res) => {
    try {
      const {
        date,
        groupId,
        subjectId,
        teacherId,
      } = req.body;

      const group =
        await AppDataSource
          .getRepository(Group)
          .findOneBy({
            id: groupId,
          });

      const subject =
        await AppDataSource
          .getRepository(Subject)
          .findOneBy({
            id: subjectId,
          });

      const teacher =
        await AppDataSource
          .getRepository(Teacher)
          .findOneBy({
            id: teacherId,
          });

      if (
        !group ||
        !subject ||
        !teacher
      ) {
        return res.status(404).json({
          message:
            "Данные не найдены",
        });
      }

      const lesson =
        AppDataSource
          .getRepository(Lesson)
          .create({
            lessonDate:
              date,

            topic:
              "Новая тема",

            group,

            subject,

            teacher,
          });

      await AppDataSource
        .getRepository(Lesson)
        .save(lesson);

      return res.json(
        lesson
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка создания пары",
      });
    }
  }
);

router.delete(
  "/:id",

  authMiddleware,

  roleMiddleware([
    "ADMIN",
  ]),

  async (req, res) => {
    try {
      const lessonId =
        Number(
          req.params.id
        );

      const repo =
        AppDataSource.getRepository(
          Lesson
        );

      const lesson =
        await repo.findOneBy({
          id: lessonId,
        });

      if (!lesson) {
        return res.status(404).json({
          message:
            "Пара не найдена",
        });
      }

      await repo.remove(
        lesson
      );

      return res.json({
        message:
          "Пара удалена",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка удаления пары",
      });
    }
  }
);

export default router;