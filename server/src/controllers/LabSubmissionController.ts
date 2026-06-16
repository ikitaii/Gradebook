import { Response } from "express";
import { AppDataSource } from "../database/data-source";
import { LabSubmission } from "../entities/LabSubmission";
import { Student } from "../entities/Student";
import { Lab } from "../entities/Lab";
import { AuthRequest } from "../middlewares/authMiddleware";

export class LabSubmissionController {
  static async getAll(_req: AuthRequest, res: Response) {
    try {
      const submissions = await AppDataSource.getRepository(LabSubmission).find({
        relations: {
          student: { user: true },
          lab: { subject: true },
        },
        order: { createdAt: "DESC" },
      });
      return res.json(submissions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка получения работ" });
    }
  }

  static async getMy(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const student = await AppDataSource.getRepository(Student).findOne({
        where: { user: { id: userId } },
      });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const submissions = await AppDataSource.getRepository(LabSubmission).find({
        where: { student: { id: student.id } },
        relations: { lab: { subject: true }, student: { user: true } },
        order: { createdAt: "DESC" },
      });

      return res.json(submissions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка получения работ" });
    }
  }

  static async submit(req: AuthRequest, res: Response) {
    try {
      const { labId, fileUrl } = req.body;
      const userId = req.user?.id;

      const student = await AppDataSource.getRepository(Student).findOne({
        where: { user: { id: userId } },
      });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const lab = await AppDataSource.getRepository(Lab).findOneBy({
        id: Number(labId),
      });
      if (!lab) {
        return res.status(404).json({ message: "Лабораторная не найдена" });
      }

      if (!fileUrl) {
        return res.status(400).json({ message: "Укажите ссылку или загрузите файл" });
      }

      const repo = AppDataSource.getRepository(LabSubmission);
      const existing = await repo.findOne({
        where: {
          student: { id: student.id },
          lab: { id: lab.id },
        },
      });

      if (existing) {
        existing.fileUrl = fileUrl;
        existing.checked = false;
        await repo.save(existing);
        return res.json(existing);
      }

      const submission = repo.create({
        student,
        lab,
        fileUrl,
        checked: false,
      });

      await repo.save(submission);
      return res.status(201).json(submission);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка отправки работы" });
    }
  }

  static async review(req: AuthRequest, res: Response) {
    try {
      const { grade, comment } = req.body;
      const id = Number(req.params.id);
      const repo = AppDataSource.getRepository(LabSubmission);
      const submission = await repo.findOne({ where: { id } });
      if (!submission) {
        return res.status(404).json({ message: "Работа не найдена" });
      }
      submission.grade = grade;
      submission.comment = comment;
      submission.checked = true;
      await repo.save(submission);
      return res.json(submission);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка проверки работы" });
    }
  }
}
