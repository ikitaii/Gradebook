import { Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Lab } from "../entities/Lab";
import { Team } from "../entities/Team";
import { LabSubmission } from "../entities/LabSubmission";
import { Student } from "../entities/Student";
import { AuthRequest } from "../middlewares/authMiddleware";

export class LabController {
  static async getAll(_req: AuthRequest, res: Response) {
    try {
      const labs = await AppDataSource.getRepository(Lab).find({
        relations: { subject: true, teacher: { user: true } },
        order: { deadline: "ASC" },
      });

      return res.json(
        labs.map((lab) => ({
          id: lab.id,
          title: lab.title,
          description: lab.description,
          deadline: lab.deadline,
          issuedAt: lab.issuedAt,
          materialUrl: lab.materialUrl,
          subject: lab.subject?.name || "",
          subjectId: lab.subject?.id,
        }))
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка получения лабораторных" });
    }
  }

  static async getOne(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const lab = await AppDataSource.getRepository(Lab).findOne({
        where: { id },
        relations: {
          subject: true,
          teacher: { user: true },
          lesson: true,
        },
      });

      if (!lab) {
        return res.status(404).json({ message: "Лабораторная не найдена" });
      }

      const team = await AppDataSource.getRepository(Team).findOne({
        where: { lab: { id } },
        relations: { students: { user: true } },
      });

      let submission = null;
      const userId = req.user?.id;
      if (userId && req.user?.role === "STUDENT") {
        const student = await AppDataSource.getRepository(Student).findOne({
          where: { user: { id: userId } },
        });
        if (student) {
          submission = await AppDataSource.getRepository(LabSubmission).findOne({
            where: { lab: { id }, student: { id: student.id } },
          });
        }
      }

      return res.json({
        id: lab.id,
        title: lab.title,
        description: lab.description,
        deadline: lab.deadline,
        issuedAt: lab.issuedAt,
        materialUrl: lab.materialUrl,
        subject: lab.subject,
        teacher: lab.teacher,
        team: team
          ? {
              id: team.id,
              name: team.name,
              members: team.students.map((s) => ({
                id: s.id,
                fullName: s.user.fullName,
              })),
            }
          : null,
        submission,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка получения лабораторной" });
    }
  }
}
