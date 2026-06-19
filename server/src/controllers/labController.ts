import { Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Lab } from "../entities/Lab";
import { Team } from "../entities/Team";
import { LabSubmission } from "../entities/LabSubmission";
import { Student } from "../entities/Student";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Teacher } from "../entities/Teacher";
import { UserRole } from "../entities/User";
import { In } from "typeorm";

export class LabController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const role = req.user?.role as UserRole | undefined;
      const userId = req.user?.id;

      if (!role || !userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      let where: object = {};
      if (role === UserRole.TEACHER) {
        where = { teacher: { user: { id: userId } } };
      }
      if (role === UserRole.STUDENT) {
        const student = await AppDataSource.getRepository(Student).findOne({
          where: { user: { id: userId } },
          relations: { group: true },
        });

        if (!student) {
          return res.json([]);
        }
        where = { lesson: { group: { id: student.group.id } } };
      }

      const labs = await AppDataSource.getRepository(Lab).find({
        where,
        relations: { subject: true, teacher: { user: true }, lesson: { group: true } },
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
          groupId: lab.lesson?.group?.id ?? null,
          groupName: lab.lesson?.group?.name ?? null,
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

  static async getTeamCandidates(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const role = req.user?.role as UserRole | undefined;
      const userId = req.user?.id;

      if (!role || !userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      const lab = await AppDataSource.getRepository(Lab).findOne({
        where: { id },
        relations: { lesson: { group: true }, teacher: { user: true } },
      });

      if (!lab) {
        return res.status(404).json({ message: "Лабораторная не найдена" });
      }

      if (role === UserRole.TEACHER && lab.teacher?.user?.id !== userId) {
        return res.status(403).json({ message: "Нет доступа к этой лабораторной" });
      }

      if (!lab.lesson?.group?.id) {
        return res.status(400).json({ message: "Для лабораторной не назначена группа" });
      }

      const students = await AppDataSource.getRepository(Student).find({
        where: { group: { id: lab.lesson.group.id } },
        relations: { user: true, group: true },
      });

      const team = await AppDataSource.getRepository(Team).findOne({
        where: { lab: { id } },
        relations: { students: true },
      });

      return res.json({
        groupId: lab.lesson.group.id,
        groupName: lab.lesson.group.name,
        students: students.map((s) => ({
          id: s.id,
          fullName: s.user.fullName,
          expelled: s.expelled,
          isNew: s.isNew,
        })),
        team: team
          ? {
              id: team.id,
              name: team.name,
              studentIds: team.students.map((s) => s.id),
            }
          : null,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка получения кандидатов команды" });
    }
  }

  static async upsertTeam(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const role = req.user?.role as UserRole | undefined;
      const userId = req.user?.id;
      const { name, studentIds } = req.body as {
        name?: string;
        studentIds?: number[];
      };

      if (!role || !userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      if (!Array.isArray(studentIds)) {
        return res.status(400).json({ message: "studentIds должен быть массивом" });
      }

      const uniqueStudentIds = Array.from(
        new Set(studentIds.map((value) => Number(value)).filter((value) => Number.isInteger(value)))
      );

      if (uniqueStudentIds.length < 2) {
        return res.status(400).json({ message: "Для команды нужно минимум 2 студента" });
      }

      const lab = await AppDataSource.getRepository(Lab).findOne({
        where: { id },
        relations: { lesson: { group: true }, teacher: { user: true } },
      });

      if (!lab) {
        return res.status(404).json({ message: "Лабораторная не найдена" });
      }

      if (role === UserRole.TEACHER && lab.teacher?.user?.id !== userId) {
        return res.status(403).json({ message: "Нет доступа к этой лабораторной" });
      }

      if (!lab.lesson?.group?.id) {
        return res.status(400).json({ message: "Для лабораторной не назначена группа" });
      }

      const students = await AppDataSource.getRepository(Student).find({
        where: { id: In(uniqueStudentIds) },
        relations: { user: true, group: true },
      });

      if (students.length !== uniqueStudentIds.length) {
        return res.status(404).json({ message: "Некоторые студенты не найдены" });
      }

      const hasForeignGroup = students.some((student) => student.group.id !== lab.lesson.group.id);
      if (hasForeignGroup) {
        return res
          .status(400)
          .json({ message: "Команда должна состоять из студентов одной группы лабораторной" });
      }

      const repo = AppDataSource.getRepository(Team);
      let team = await repo.findOne({
        where: { lab: { id } },
        relations: { students: { user: true }, lab: true },
      });

      const teamName = (name || "").trim() || `Команда — ${lab.title}`;

      if (!team) {
        team = repo.create({
          name: teamName,
          lab,
          students,
        });
      } else {
        team.name = teamName;
        team.students = students;
      }

      await repo.save(team);

      const saved = await repo.findOne({
        where: { id: team.id },
        relations: { students: { user: true }, lab: true },
      });

      return res.json({
        id: saved?.id,
        name: saved?.name,
        labId: saved?.lab?.id,
        members:
          saved?.students.map((s) => ({
            id: s.id,
            fullName: s.user.fullName,
          })) || [],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка сохранения команды" });
    }
  }
}
