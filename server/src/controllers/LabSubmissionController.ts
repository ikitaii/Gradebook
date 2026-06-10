import {
  Request,
  Response,
} from "express";

import { AppDataSource } from "../database/data-source";

import { LabSubmission } from "../entities/LabSubmission";

export class LabSubmissionController {
  static async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const submissions =
        await AppDataSource
          .getRepository(
            LabSubmission
          )
          .find({
            relations: {
              student: {
                user: true,
              },

              lab: true,
            },

            order: {
              id: "DESC",
            },
          });

      return res.json(
        submissions
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка получения сдач",
      });
    }
  }

  static async review(
    req: Request,
    res: Response
  ) {
    try {
      const submissionId =
        Number(
          req.params.id
        );

      const {
        grade,
        comment,
      } = req.body;

      const repo =
        AppDataSource.getRepository(
          LabSubmission
        );

      const submission =
        await repo.findOneBy({
          id: submissionId,
        });

      if (!submission) {
        return res.status(404).json({
          message:
            "Сдача не найдена",
        });
      }

      submission.grade =
        grade;

      submission.comment =
        comment;

      submission.checked =
        true;

      await repo.save(
        submission
      );

      return res.json(
        submission
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка проверки лабораторной",
      });
    }
  }
}