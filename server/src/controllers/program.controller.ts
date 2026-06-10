import {
  Request,
  Response,
} from "express";

import { AppDataSource } from "../database/data-source";

import { ProgramItem } from "../entities/ProgramItem";

import { Subject } from "../entities/Subject";

export class ProgramController {
  static async get(
    req: Request,
    res: Response
  ) {
    try {
      const subjectId =
        Number(
          req.params.subjectId
        );

      const items =
        await AppDataSource
          .getRepository(
            ProgramItem
          )
          .find({
            where: {
              subject: {
                id: subjectId,
              },
            },

            order: {
              createdAt:
                "DESC",
            },
          });

      return res.json(
        items
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка получения программы",
      });
    }
  }

  static async create(
    req: Request,
    res: Response
  ) {
    try {
      const {
        subjectId,
        title,
        description,
        type,
        materialUrl,
        deadline,
        teamWork,
      } = req.body;

      const subject =
        await AppDataSource
          .getRepository(
            Subject
          )
          .findOneBy({
            id: subjectId,
          });

      if (!subject) {
        return res.status(404).json({
          message:
            "Предмет не найден",
        });
      }

      const item =
        AppDataSource
          .getRepository(
            ProgramItem
          )
          .create({
            subject,
            title,
            description,
            type,
            materialUrl,
            deadline,
            teamWork,
          });

      await AppDataSource
        .getRepository(
          ProgramItem
        )
        .save(item);

      return res.json(
        item
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка создания элемента программы",
      });
    }
  }
}