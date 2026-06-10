import {
  Request,
  Response,
} from "express";

import { AppDataSource } from "../database/data-source";

import { Student } from "../entities/Student";

import { Teacher } from "../entities/Teacher";

import { Lesson } from "../entities/Lesson";

import { Lab } from "../entities/Lab";

import { Grade } from "../entities/Grade";

import { Attendance } from "../entities/Attendance";

export class DashboardController {
  static async get(
    req: Request,
    res: Response
  ) {
    try {
      const studentsCount =
        await AppDataSource
          .getRepository(
            Student
          )
          .count();

      const teachersCount =
        await AppDataSource
          .getRepository(
            Teacher
          )
          .count();

      const lessonsCount =
        await AppDataSource
          .getRepository(
            Lesson
          )
          .count();

      const labsCount =
        await AppDataSource
          .getRepository(
            Lab
          )
          .count();

      const grades =
        await AppDataSource
          .getRepository(
            Grade
          )
          .find();

      const attendances =
        await AppDataSource
          .getRepository(
            Attendance
          )
          .find();

      let averageGrade = 0;

      if (grades.length > 0 ) {
        averageGrade = grades.reduce(( acc, current) => acc +current.value,0) /grades.length;
      }

      const presentCount =
        attendances.filter(
          (
            attendance
          ) =>
            attendance.status ===
            "PRESENT"
        ).length;

      const attendancePercent =
        attendances.length > 0
          ? Math.round(
              (presentCount /
                attendances.length) *
                100
            )
          : 0;

      const latestLessons =
        await AppDataSource
          .getRepository(
            Lesson
          )
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
                "DESC",
            },

            take: 5,
          });

      return res.json({
        studentsCount,

        teachersCount,

        lessonsCount,

        labsCount,

        averageGrade:
          averageGrade.toFixed(
            1
          ),

        attendancePercent,

        latestLessons,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Ошибка получения dashboard",
      });
    }
  }
}