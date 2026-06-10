import { Request, Response } from "express";

import { AppDataSource } from "../database/data-source";

import { Student } from "../entities/Student";
import { Lesson } from "../entities/Lesson";
import { Grade } from "../entities/Grade";
import { Attendance } from "../entities/Attendance";

export class JournalController {
  static async get(
    req: Request,
    res: Response
  ) {
    try {
      const {
        groupId,
        subjectId,
      } = req.query;

      const students =
        await AppDataSource
          .getRepository(
            Student
          )
          .find({
            where: groupId
              ? {
                  group: {
                    id: Number(
                      groupId
                    ),
                  },
                }
              : {},
            relations: {
              user: true,
              group: true,
            },
          });

      const lessons =
        await AppDataSource
          .getRepository(
            Lesson
          )
          .find({
            where:
              groupId &&
              subjectId
                ? {
                    group: {
                      id: Number(
                        groupId
                      ),
                    },

                    subject: {
                      id: Number(
                        subjectId
                      ),
                    },
                  }
                : {},
            relations: {
              subject: true,
              group: true,
            },

            order: {
              lessonDate:
                "ASC",
            },
          });

      const grades =
        await AppDataSource
          .getRepository(
            Grade
          )
          .find({
            relations: {
              student: true,
              lesson: true,
            },
          });

      const attendances =
        await AppDataSource
          .getRepository(
            Attendance
          )
          .find({
            relations: {
              student: true,
              lesson: true,
            },
          });

      return res.json({
        students,
        lessons,
        grades,
        attendances,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка получения журнала",
      });
    }
  }

  static async setGrade(
    req: Request,
    res: Response
  ) {
    try {
      const {
        studentId,
        lessonId,
        value,
      } = req.body;

      const student =
        await AppDataSource
          .getRepository(
            Student
          )
          .findOneBy({
            id: studentId,
          });

      const lesson =
        await AppDataSource
          .getRepository(
            Lesson
          )
          .findOneBy({
            id: lessonId,
          });

      if (
        !student ||
        !lesson
      ) {
        return res.status(404).json({
          message:
            "Данные не найдены",
        });
      }

      const repo =
        AppDataSource.getRepository(
          Grade
        );

      let grade =
        await repo.findOne({
          where: {
            student: {
              id: studentId,
            },

            lesson: {
              id: lessonId,
            },
          },

          relations: {
            student: true,
            lesson: true,
          },
        });

      if (grade) {
        grade.value =
          value;
      } else {
        grade =
          repo.create({
            value,
            student,
            lesson,
          });
      }

      await repo.save(
        grade
      );

      return res.json(
        grade
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка оценки",
      });
    }
  }

  static async setAttendance(
    req: Request,
    res: Response
  ) {
    try {
      const {
        studentId,
        lessonId,
        status,
      } = req.body;

      const student =
        await AppDataSource
          .getRepository(
            Student
          )
          .findOneBy({
            id: studentId,
          });

      const lesson =
        await AppDataSource
          .getRepository(
            Lesson
          )
          .findOneBy({
            id: lessonId,
          });

      if (
        !student ||
        !lesson
      ) {
        return res.status(404).json({
          message:
            "Данные не найдены",
        });
      }

      const repo =
        AppDataSource.getRepository(
          Attendance
        );

      let attendance =
        await repo.findOne({
          where: {
            student: {
              id: studentId,
            },

            lesson: {
              id: lessonId,
            },
          },

          relations: {
            student: true,
            lesson: true,
          },
        });

      if (
        attendance
      ) {
        attendance.status =
          status;
      } else {
        attendance =
          repo.create({
            status,
            student,
            lesson,
          });
      }

      await repo.save(
        attendance
      );

      return res.json(
        attendance
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка посещаемости",
      });
    }
  }
}