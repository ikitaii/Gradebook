import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Grade } from "../entities/Grade";
import { Attendance } from "../entities/Attendance";
import { Lesson } from "../entities/Lesson";
import { Student } from "../entities/Student";

export class StudentGradesController {
  static async getStudentGrades(req: Request, res: Response) {
    try {
      const studentId = Number(req.params.id);
      if (!Number.isInteger(studentId)) {
        return res.status(400).json({ message: "Invalid student id" });
      }
 
      // Verify student exists
      const student = await AppDataSource.getRepository(Student).findOneBy({ id: studentId });
      if (!student) {
        return res.status(404).json({ message: "Студент не найден" });
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