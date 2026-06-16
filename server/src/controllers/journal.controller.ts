import { Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Student } from "../entities/Student";
import { Lesson } from "../entities/Lesson";
import { Grade } from "../entities/Grade";
import { Attendance, AttendanceStatus } from "../entities/Attendance";
import { Teacher } from "../entities/Teacher";
import { Group } from "../entities/Group";
import { Subject } from "../entities/Subject";
import { AuthRequest } from "../middlewares/authMiddleware";
import { In } from "typeorm";

const LESSON_SLOTS = [
  { start: "08:30", end: "10:00" },
  { start: "10:15", end: "11:45" },
  { start: "12:15", end: "13:45" },
  { start: "14:15", end: "15:45" },
];

function isValidGrade(value: number): boolean {
  return (
    (value >= 2 && value <= 5) ||
    (value >= 7 && value <= 10)
  );
}

function getSlotForLesson(lessonDate: Date) {
  const hours = lessonDate.getHours();
  const minutes = lessonDate.getMinutes();
  const total = hours * 60 + minutes;

  for (const slot of LESSON_SLOTS) {
    const [sh, sm] = slot.start.split(":").map(Number);
    const [eh, em] = slot.end.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    if (total >= startMin && total <= endMin) {
      return slot;
    }
  }
  return LESSON_SLOTS[0];
}

function computeAutoStatus(lesson: Lesson, explicit?: string): AttendanceStatus {
  if (explicit === AttendanceStatus.ABSENT) {
    return AttendanceStatus.ABSENT;
  }
  if (explicit === AttendanceStatus.LATE) {
    return AttendanceStatus.LATE;
  }

  const slot = getSlotForLesson(new Date(lesson.lessonDate));
  const now = new Date();
  const lessonDay = new Date(lesson.lessonDate);
  const [sh, sm] = slot.start.split(":").map(Number);
  const [eh, em] = slot.end.split(":").map(Number);

  const start = new Date(lessonDay);
  start.setHours(sh, sm, 0, 0);
  const end = new Date(lessonDay);
  end.setHours(eh, em, 0, 0);

  if (now > start && now <= end) {
    return AttendanceStatus.LATE;
  }
  if (now > end) {
    return AttendanceStatus.ABSENT;
  }
  return AttendanceStatus.PRESENT;
}

export class JournalController {
  static async getAssignments(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const teacher = await AppDataSource.getRepository(Teacher).findOne({
        where: { user: { id: userId } },
        relations: {
          teacherSubjects: { group: true, subject: true },
        },
      });

      if (!teacher) {
        return res.status(404).json({ message: "Teacher profile not found" });
      }

      let assignments: Array<{
        groupId: number;
        groupName: string;
        subjectId: number;
        subjectName: string;
      }> = [];

      if (teacher.teacherSubjects?.length) {
        assignments = teacher.teacherSubjects.map((ts) => ({
          groupId: ts.group.id,
          groupName: ts.group.name,
          subjectId: ts.subject.id,
          subjectName: ts.subject.name,
        }));
      } else {
        const lessons = await AppDataSource.getRepository(Lesson).find({
          where: { teacher: { id: teacher.id } },
          relations: { group: true, subject: true },
        });
        const seen = new Set<string>();
        for (const lesson of lessons) {
          const key = `${lesson.group.id}-${lesson.subject.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            assignments.push({
              groupId: lesson.group.id,
              groupName: lesson.group.name,
              subjectId: lesson.subject.id,
              subjectName: lesson.subject.name,
            });
          }
        }
      }

      return res.json({ teacherId: teacher.id, assignments });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка получения назначений" });
    }
  }

  static async get(req: AuthRequest, res: Response) {
    try {
      const { groupId, subjectId } = req.query;

      if (!groupId || !subjectId) {
        return res.json({
          students: [],
          lessons: [],
          grades: [],
          attendances: [],
        });
      }

      const gId = Number(groupId);
      const sId = Number(subjectId);

      const students = await AppDataSource.getRepository(Student).find({
        where: { group: { id: gId } },
        relations: { user: true, group: true },
        order: { id: "ASC" },
      });

      const lessons = await AppDataSource.getRepository(Lesson).find({
        where: {
          group: { id: gId },
          subject: { id: sId },
        },
        relations: { subject: true, group: true },
        order: { lessonDate: "ASC" },
      });

      const lessonIds = lessons.map((l) => l.id);
      const studentIds = students.map((s) => s.id);

      const grades =
        lessonIds.length && studentIds.length
          ? await AppDataSource.getRepository(Grade).find({
              where: {
                lesson: { id: In(lessonIds) },
                student: { id: In(studentIds) },
              },
              relations: { student: true, lesson: true },
            })
          : [];

      const attendances =
        lessonIds.length && studentIds.length
          ? await AppDataSource.getRepository(Attendance).find({
              where: {
                lesson: { id: In(lessonIds) },
                student: { id: In(studentIds) },
              },
              relations: { student: true, lesson: true },
            })
          : [];

      return res.json({ students, lessons, grades, attendances });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка получения журнала" });
    }
  }

  static async addLesson(req: AuthRequest, res: Response) {
    try {
      const { groupId, subjectId, date } = req.body;
      const userId = req.user?.id;

      const teacher = await AppDataSource.getRepository(Teacher).findOne({
        where: { user: { id: userId } },
      });
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      const group = await AppDataSource.getRepository(Group).findOneBy({
        id: Number(groupId),
      });
      const subject = await AppDataSource.getRepository(Subject).findOneBy({
        id: Number(subjectId),
      });

      if (!group || !subject) {
        return res.status(404).json({ message: "Группа или предмет не найдены" });
      }

      const lesson = AppDataSource.getRepository(Lesson).create({
        lessonDate: date ? new Date(date) : new Date(),
        topic: "Новый урок",
        group,
        subject,
        teacher,
      });

      await AppDataSource.getRepository(Lesson).save(lesson);

      const saved = await AppDataSource.getRepository(Lesson).findOne({
        where: { id: lesson.id },
        relations: { subject: true, group: true },
      });

      return res.status(201).json(saved);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка создания урока" });
    }
  }

  static async setGrade(req: AuthRequest, res: Response) {
    try {
      const { studentId, lessonId, value } = req.body;

      if (!isValidGrade(Number(value))) {
        return res.status(400).json({
          message: "Оценка должна быть от 2 до 5 или от 7 до 10",
        });
      }

      const student = await AppDataSource.getRepository(Student).findOneBy({
        id: studentId,
      });
      const lesson = await AppDataSource.getRepository(Lesson).findOneBy({
        id: lessonId,
      });

      if (!student || !lesson) {
        return res.status(404).json({ message: "Данные не найдены" });
      }

      await AppDataSource.getRepository(Attendance).delete({
        student: { id: studentId },
        lesson: { id: lessonId },
      });

      const repo = AppDataSource.getRepository(Grade);
      let grade = await repo.findOne({
        where: {
          student: { id: studentId },
          lesson: { id: lessonId },
        },
        relations: { student: true, lesson: true },
      });

      if (grade) {
        grade.value = value;
      } else {
        grade = repo.create({ value, student, lesson });
      }

      await repo.save(grade);
      return res.json(grade);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка оценки" });
    }
  }

  static async setAttendance(req: AuthRequest, res: Response) {
    try {
      const { studentId, lessonId, status } = req.body;

      const student = await AppDataSource.getRepository(Student).findOneBy({
        id: studentId,
      });
      const lesson = await AppDataSource.getRepository(Lesson).findOneBy({
        id: lessonId,
      });

      if (!student || !lesson) {
        return res.status(404).json({ message: "Данные не найдены" });
      }

      await AppDataSource.getRepository(Grade).delete({
        student: { id: studentId },
        lesson: { id: lessonId },
      });

      const finalStatus = computeAutoStatus(
        lesson,
        status === AttendanceStatus.ABSENT
          ? AttendanceStatus.ABSENT
          : AttendanceStatus.LATE
      );

      const repo = AppDataSource.getRepository(Attendance);
      let attendance = await repo.findOne({
        where: {
          student: { id: studentId },
          lesson: { id: lessonId },
        },
        relations: { student: true, lesson: true },
      });

      if (attendance) {
        attendance.status = finalStatus;
      } else {
        attendance = repo.create({
          status: finalStatus,
          student,
          lesson,
        });
      }

      await repo.save(attendance);
      return res.json(attendance);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка посещаемости" });
    }
  }
}
