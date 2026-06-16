import { Response } from "express";
import { Between } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Student } from "../entities/Student";
import { Teacher } from "../entities/Teacher";
import { Lesson } from "../entities/Lesson";
import { Lab } from "../entities/Lab";
import { Grade } from "../entities/Grade";
import { Attendance } from "../entities/Attendance";
import { Schedule } from "../entities/Schedule";
import { AuthRequest } from "../middlewares/authMiddleware";

const DAY_NAMES = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export class DashboardController {
  static async get(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role;
      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);
      const todayName = DAY_NAMES[today.getDay()];

      if (role === "TEACHER") {
        const teacher = await AppDataSource.getRepository(Teacher).findOne({
          where: { user: { id: userId } },
        });

        const todayLessons = teacher
          ? await AppDataSource.getRepository(Lesson).find({
              where: {
                teacher: { id: teacher.id },
                lessonDate: Between(todayStart, todayEnd),
              },
              relations: {
                subject: true,
                group: true,
                teacher: { user: true },
              },
              order: { lessonDate: "ASC" },
            })
          : [];

        const uncheckedLabs = await AppDataSource.getRepository(Lab).count();

        return res.json({
          role: "TEACHER",
          todayLessons,
          lessonsCount: todayLessons.length,
          labsCount: uncheckedLabs,
          studentsCount: await AppDataSource.getRepository(Student).count(),
        });
      }

      if (role === "STUDENT") {
        const student = await AppDataSource.getRepository(Student).findOne({
          where: { user: { id: userId } },
          relations: { group: true, user: true },
        });

        if (!student) {
          return res.status(404).json({ message: "Student profile not found" });
        }

        const todaySchedule = await AppDataSource.getRepository(Schedule).find({
          where: {
            group: { id: student.group.id },
            dayOfWeek: todayName,
          },
          relations: {
            subject: true,
            teacher: { user: true },
            group: true,
          },
          order: { startTime: "ASC" },
        });

        const grades = await AppDataSource.getRepository(Grade).find({
          where: { student: { id: student.id } },
        });
        const attendances = await AppDataSource.getRepository(Attendance).find({
          where: { student: { id: student.id } },
        });

        const averageGrade =
          grades.length > 0
            ? (grades.reduce((a, g) => a + g.value, 0) / grades.length).toFixed(1)
            : "0";

        const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
        const attendancePercent =
          attendances.length > 0
            ? Math.round((presentCount / attendances.length) * 100)
            : 100;

        return res.json({
          role: "STUDENT",
          todaySchedule,
          averageGrade,
          attendancePercent,
          lessonsCount: todaySchedule.length,
          student,
        });
      }

      const studentsCount = await AppDataSource.getRepository(Student).count();
      const teachersCount = await AppDataSource.getRepository(Teacher).count();
      const lessonsCount = await AppDataSource.getRepository(Lesson).count();
      const labsCount = await AppDataSource.getRepository(Lab).count();
      const grades = await AppDataSource.getRepository(Grade).find();
      const attendances = await AppDataSource.getRepository(Attendance).find();

      const averageGrade =
        grades.length > 0
          ? (grades.reduce((a, g) => a + g.value, 0) / grades.length).toFixed(1)
          : "0";

      const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
      const attendancePercent =
        attendances.length > 0
          ? Math.round((presentCount / attendances.length) * 100)
          : 0;

      const latestLessons = await AppDataSource.getRepository(Lesson).find({
        relations: { subject: true, group: true, teacher: { user: true } },
        order: { lessonDate: "DESC" },
        take: 5,
      });

      return res.json({
        role: "ADMIN",
        studentsCount,
        teachersCount,
        lessonsCount,
        labsCount,
        averageGrade,
        attendancePercent,
        latestLessons,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка получения dashboard" });
    }
  }
}
