import {
  Request,
  Response,
} from "express";

import { AppDataSource } from "../database/data-source";

import { Lesson } from "../entities/Lesson";

import { Grade } from "../entities/Grade";

import { Attendance } from "../entities/Attendance";

import { Student } from "../entities/Student";

export class JournalController {
  static async get(
    req: Request,
    res: Response
  ) {
    try {
      const groupId = Number(
        req.query.groupId
      );

      const lessons =
        await AppDataSource
          .getRepository(Lesson)
          .find({
            where: {
              group: {
                id: groupId,
              },
            },

            relations: {
              subject: true,
            },

            order: {
              lessonDate:
                "ASC",
            },
          });

      const students =
        await AppDataSource
          .getRepository(Student)
          .find({
            where: {
              group: {
                id: groupId,
              },
            },

            relations: {
              user: true,
            },
          });

      const grades =
        await AppDataSource
          .getRepository(Grade)
          .find({
            relations: {
              lesson: true,
              student: true,
            },
          });

      const attendance =
        await AppDataSource
          .getRepository(
            Attendance
          )
          .find({
            relations: {
              lesson: true,
              student: true,
            },
          });

      const result =
        students.map(
          (student) => {
            const studentGrades =
              lessons.map(
                (lesson) => {
                  const found =
                    grades.find(
                      (
                        grade
                      ) =>
                        grade
                          .student
                          .id ===
                          student.id &&
                        grade
                          .lesson
                          .id ===
                          lesson.id
                    );

                  return {
                    lessonId:
                      lesson.id,

                    lessonDate:
                      lesson.lessonDate,

                    value:
                      found?.value ||
                      null,

                    gradeId:
                      found?.id ||
                      null,
                  };
                }
              );

            const studentAttendance =
              lessons.map(
                (lesson) => {
                  const found =
                    attendance.find(
                      (
                        item
                      ) =>
                        item
                          .student
                          .id ===
                          student.id &&
                        item
                          .lesson
                          .id ===
                          lesson.id
                    );

                  return {
                    lessonId:
                      lesson.id,

                    lessonDate:
                      lesson.lessonDate,

                    present:
                      found?.status ||
                      false,

                    attendanceId:
                      found?.id ||
                      null,
                  };
                }
              );

            return {
              student: {
                id: student.id,

                fullName:
                  student.user
                    .fullName,
              },

              expelled:
                student.expelled,

              isNew:
                student.isNew,

              grades:
                studentGrades,

              attendance:
                studentAttendance,
            };
          }
        );

      return res.json({
        lessons,

        students: result,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка получения журнала",
      });
    }
  }

  static async createLesson(
    req: Request,
    res: Response
  ) {
    try {
      const repo =
        AppDataSource.getRepository(
          Lesson
        );

      const lesson =
        repo.create(req.body);

      const saved =
        await repo.save(
          lesson
        );

      return res.json(saved);
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка создания урока",
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

        await repo.save(
          grade
        );

        return res.json(
          grade
        );
      }

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

      grade = repo.create({
        value,

        student,

        lesson,
      });

      const saved =
        await repo.save(
          grade
        );

      return res.json(saved);
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

      if (attendance) {
        attendance.status =
          status;

        await repo.save(
          attendance
        );

        return res.json(
          attendance
        );
      }

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

      attendance =
        repo.create({
          status,

          student,

          lesson,
        });

      const saved =
        await repo.save(
          attendance
        );

      return res.json(saved);
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка посещаемости",
      });
    }
  }
}