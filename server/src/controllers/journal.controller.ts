
import { Request, Response } from "express";
import { JournalService } from "../services/journal.service";
import { AppDataSource } from "../database/data-source";
import { Lesson } from "../entities/Lesson";
import { Grade } from "../entities/Grade";
import { Attendance } from "../entities/Attendance";

export class JournalController {
  static async get(req: Request, res: Response) {
    const groupId = Number(req.query.groupId);
    const subjectId = Number(req.query.subjectId);

    const data = await JournalService.getJournal(groupId, subjectId);

    res.json(data);
  }
  static async createLesson(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Lesson);
    const lesson = repo.create(req.body);
    const saved = await repo.save(lesson);
    res.json(saved);
  }
  static async setGrade(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Grade);
    const grade = repo.create(req.body);
    const saved = await repo.save(grade);
    res.json(saved);
  }
  static async setAttendance(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Attendance);
    const attendance = repo.create(req.body);
    const saved = await repo.save(attendance);
    res.json(saved);
  }
}