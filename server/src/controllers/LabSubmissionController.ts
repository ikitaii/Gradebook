import { Response } from "express";
import { AppDataSource } from "../database/data-source";
import { LabSubmission } from "../entities/LabSubmission";
import { Student } from "../entities/Student";
import { Lab } from "../entities/Lab";
import { AuthRequest } from "../middlewares/authMiddleware";
import { UserRole } from "../entities/User";
import { Teacher } from "../entities/Teacher";

export class LabSubmissionController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const role = req.user?.role as UserRole | undefined;
      const userId = req.user?.id;

      if (!role || !userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      const where =
        role === UserRole.TEACHER
          ? await (async () => {
              const teacher = await AppDataSource.getRepository(Teacher).findOne({
                where: { user: { id: userId } },
              });
              return teacher ? { lab: { teacher: { id: teacher.id } } } : { id: -1 };
            })()
          : {};

      const submissions = await AppDataSource.getRepository(LabSubmission).find({
        where,
        relations: {
          student: { user: true },
          lab: { subject: true, teacher: { user: true } },
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

      if (!Number.isInteger(Number(labId))) {
        return res.status(400).json({ message: "Некорректный labId" });
      }

      if (!String(fileUrl || "").trim()) {
        return res.status(400).json({ message: "Укажите ссылку или загрузите файл" });
      }

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

      const repo = AppDataSource.getRepository(LabSubmission);
      const existing = await repo.findOne({
        where: {
          student: { id: student.id },
          lab: { id: lab.id },
        },
      });

      if (existing) {
        existing.fileUrl = String(fileUrl).trim();
        existing.checked = false;
        await repo.save(existing);
        return res.json(existing);
      }

      const submission = repo.create({
        student,
        lab,
        fileUrl: String(fileUrl).trim(),
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
      const role = req.user?.role as UserRole | undefined;
      const userId = req.user?.id;

      if (!Number.isFinite(Number(grade)) || Number(grade) < 0 || Number(grade) > 100) {
        return res.status(400).json({ message: "Оценка должна быть числом от 0 до 100" });
      }

      const repo = AppDataSource.getRepository(LabSubmission);
      const submission = await repo.findOne({
        where: { id },
        relations: { lab: { teacher: { user: true } } },
      });
      if (!submission) {
        return res.status(404).json({ message: "Работа не найдена" });
      }

      if (role === UserRole.TEACHER && submission.lab.teacher.user.id !== userId) {
        return res.status(403).json({ message: "Нет доступа к проверке этой работы" });
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
