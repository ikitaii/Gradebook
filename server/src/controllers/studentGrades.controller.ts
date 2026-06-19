import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Grade } from "../entities/Grade";
import { Attendance } from "../entities/Attendance";
import { Lesson } from "../entities/Lesson";
import { Student } from "../entities/Student";
import { Teacher } from "../entities/Teacher";
import { AuthRequest } from "../middlewares/authMiddleware";
import { UserRole } from "../entities/User";

export class StudentGradesController {
  static async getStudentGrades(req: AuthRequest, res: Response) {
    try {
      const studentId = Number(req.params.id);
      if (!Number.isInteger(studentId)) {
        return res.status(400).json({ message: "Invalid student id" });
      }

      const role = req.user?.role as UserRole | undefined;
      const userId = req.user?.id;

      if (!role || !userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }
 
      // Verify student exists
      const student = await AppDataSource.getRepository(Student).findOne({
        where: { id: studentId },
        relations: { group: true },
      });
      if (!student) {
        return res.status(404).json({ message: "Студент не найден" });
      }

      if (role === UserRole.TEACHER) {
        const teacher = await AppDataSource.getRepository(Teacher).findOne({
          where: { user: { id: userId } },
          relations: { teacherSubjects: { group: true } },
        });

        if (!teacher) {
          return res.status(403).json({ message: "Нет доступа" });
        }

        const teachesGroup =
          teacher.teacherSubjects?.some((ts) => ts.group.id === student.group.id) ?? false;

        if (!teachesGroup) {
          const scheduled = await AppDataSource.getRepository(Lesson).findOne({
            where: {
              teacher: { id: teacher.id },
              group: { id: student.group.id },
            },
          });

          if (!scheduled) {
            return res.status(403).json({ message: "Нет доступа к оценкам этого студента" });
          }
        }
      }

      // Load grades with lesson and subject
      const grades = await AppDataSource.getRepository(Grade)
        .createQueryBuilder("grade")
        .innerJoinAndSelect("grade.lesson", "lesson")
        .innerJoinAndSelect("lesson.subject", "subject")
        .where("grade.studentId = :studentId", { studentId })
        .getMany();

      // Load attendances with lesson and subject
      const attendances = await AppDataSource.getRepository(Attendance)
        .createQueryBuilder("attendance")
        .innerJoinAndSelect("attendance.lesson", "lesson")
        .innerJoinAndSelect("lesson.subject", "subject")
        .where("attendance.studentId = :studentId", { studentId })
        .getMany();

      // Merge grades and attendances by lesson
      const lessonMap = new Map<number, {
        lesson: Lesson;
        value: number | null;
        attendance: Attendance | null;
      }>();

      grades.forEach(g => {
        const lessonId = g.lesson.id;
        if (!lessonMap.has(lessonId)) {
          lessonMap.set(lessonId, {
            lesson: g.lesson,
            value: g.value,
            attendance: null,
          });
        } else {
          lessonMap.get(lessonId)!.value = g.value;
        }
      });

      attendances.forEach(a => {
        const lessonId = a.lesson.id;
        if (!lessonMap.has(lessonId)) {
          lessonMap.set(lessonId, {
            lesson: a.lesson,
            value: null,
            attendance: a,
          });
        } else {
          lessonMap.get(lessonId)!.attendance = a;
        }
      });

      const result = Array.from(lessonMap.values()).map(item => ({
        lesson: item.lesson,
        value: item.value,
        attendance: item.attendance,
      }));

      return res.json(result);
    } catch (error) {
      console.error("Error in StudentGradesController.getStudentGrades:", error);
      return res.status(500).json({ message: "Ошибка получения оценок студента" });
    }
  }
}