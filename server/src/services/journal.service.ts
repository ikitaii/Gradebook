import { AppDataSource } from "../database/data-source";
import { Student } from "../entities/Student";
import { Lesson } from "../entities/Lesson";
import { Grade } from "../entities/Grade";
import { Attendance } from "../entities/Attendance";
import { In } from "typeorm";

export class JournalService {
  static async getJournal(groupId: number, subjectId: number) {
    const studentRepo = AppDataSource.getRepository(Student);
    const lessonRepo = AppDataSource.getRepository(Lesson);
    const gradeRepo = AppDataSource.getRepository(Grade);
    const attendanceRepo = AppDataSource.getRepository(Attendance);
    const students = await studentRepo.find({
      where: {
        group: { id: groupId },
      },
    });
    const lessons = await lessonRepo.find({
      where: {
        group: { id: groupId },
        subject: { id: subjectId },
      },
    });

    const lessonIds = lessons.map((l) => l.id);
    const grades = lessonIds.length
      ? await gradeRepo.find({
          where: {
            lesson: {
              id: In(lessonIds),
            },
          },
        })
      : [];
    const attendance = lessonIds.length
      ? await attendanceRepo.find({
          where: {
            lesson: {
              id: In(lessonIds),
            },
          },
        })
      : [];

    return {
      students,
      lessons,
      grades,
      attendance,
    };
  }
}