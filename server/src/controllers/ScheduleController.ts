import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Schedule } from "../entities/Schedule";
import { Group } from "../entities/Group";
import { Subject } from "../entities/Subject";
import { Teacher } from "../entities/Teacher";
import { AuthRequest } from "../middlewares/authMiddleware";
import { UserRole } from "../entities/User";

export class ScheduleController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const role = req.user?.role as UserRole | undefined;
      const userId = req.user?.id;
      const repo = AppDataSource.getRepository(Schedule);

      if (!role || !userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      const where =
        role === UserRole.STUDENT
          ? await (async () => {
              const studentGroup = await AppDataSource.getRepository(Group)
                .createQueryBuilder("group")
                .innerJoin("group.students", "student")
                .innerJoin("student.user", "user")
                .where("user.id = :userId", { userId })
                .getOne();

              return studentGroup ? { group: { id: studentGroup.id } } : { id: -1 };
            })()
          : role === UserRole.TEACHER
          ? await (async () => {
              const teacher = await AppDataSource.getRepository(Teacher).findOne({
                where: { user: { id: userId } },
              });

              return teacher ? { teacher: { id: teacher.id } } : { id: -1 };
            })()
          : {};

      const schedules = await repo.find({
        where,
        relations: {
          group: true,
          subject: true,
          teacher: { user: true },
        },
        order: { dayOfWeek: "ASC", startTime: "ASC" },
      });
      return res.json(schedules);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка получения расписания" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { groupId, subjectId, teacherId, dayOfWeek, startTime, endTime, room } =
        req.body;

      const group = await AppDataSource.getRepository(Group).findOneBy({
        id: Number(groupId),
      });
      const subject = await AppDataSource.getRepository(Subject).findOneBy({
        id: Number(subjectId),
      });
      const teacher = await AppDataSource.getRepository(Teacher).findOneBy({
        id: Number(teacherId),
      });

      if (!group || !subject || !teacher) {
        return res.status(404).json({ message: "Группа, предмет или преподаватель не найдены" });
      }

      const schedule = AppDataSource.getRepository(Schedule).create({
        group,
        subject,
        teacher,
        dayOfWeek,
        startTime,
        endTime,
        room: room || "",
      });

      await AppDataSource.getRepository(Schedule).save(schedule);

      const saved = await AppDataSource.getRepository(Schedule).findOne({
        where: { id: schedule.id },
        relations: { group: true, subject: true, teacher: { user: true } },
      });

      return res.status(201).json(saved);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка создания записи расписания" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { groupId, subjectId, teacherId, dayOfWeek, startTime, endTime, room } =
        req.body;

      const repo = AppDataSource.getRepository(Schedule);
      const schedule = await repo.findOne({ where: { id } });

      if (!schedule) {
        return res.status(404).json({ message: "Запись не найдена" });
      }

      if (groupId) {
        const group = await AppDataSource.getRepository(Group).findOneBy({
          id: Number(groupId),
        });
        if (!group) return res.status(404).json({ message: "Группа не найдена" });
        schedule.group = group;
      }
      if (subjectId) {
        const subject = await AppDataSource.getRepository(Subject).findOneBy({
          id: Number(subjectId),
        });
        if (!subject) return res.status(404).json({ message: "Предмет не найден" });
        schedule.subject = subject;
      }
      if (teacherId) {
        const teacher = await AppDataSource.getRepository(Teacher).findOneBy({
          id: Number(teacherId),
        });
        if (!teacher) return res.status(404).json({ message: "Преподаватель не найден" });
        schedule.teacher = teacher;
      }
      if (dayOfWeek !== undefined) schedule.dayOfWeek = dayOfWeek;
      if (startTime !== undefined) schedule.startTime = startTime;
      if (endTime !== undefined) schedule.endTime = endTime;
      if (room !== undefined) schedule.room = room;

      await repo.save(schedule);

      const saved = await repo.findOne({
        where: { id },
        relations: { group: true, subject: true, teacher: { user: true } },
      });

      return res.json(saved);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка обновления расписания" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const repo = AppDataSource.getRepository(Schedule);
      const schedule = await repo.findOne({ where: { id } });

      if (!schedule) {
        return res.status(404).json({ message: "Запись не найдена" });
      }

      await repo.remove(schedule);
      return res.json({ message: "Запись удалена" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка удаления записи" });
    }
  }
}
