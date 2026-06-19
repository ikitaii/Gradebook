import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { AppDataSource } from "../database/data-source";

import { Student } from "../entities/Student";

import { User, UserRole } from "../entities/User";

import { Group } from "../entities/Group";
import { Schedule } from "../entities/Schedule";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Teacher } from "../entities/Teacher";

export class StudentController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const studentRepository =
        AppDataSource.getRepository(Student);

      const role = req.user?.role as UserRole | undefined;
      const userId = req.user?.id;

      if (!role || !userId) {
        return res.status(401).json({
          message: "Не авторизован",
        });
      }

      if (role === UserRole.ADMIN) {
        const students =
          await studentRepository.find({
            relations: {
              user: true,
              group: true,
            },
          });

        return res.json(students);
      }

      if (role === UserRole.TEACHER) {
        const teacher = await AppDataSource.getRepository(Teacher).findOne({
          where: { user: { id: userId } },
          relations: {
            teacherSubjects: { group: true },
          },
        });

        if (!teacher) {
          return res.json([]);
        }

        const groupIds = new Set<number>();
        teacher.teacherSubjects?.forEach((ts) => groupIds.add(ts.group.id));

        if (!groupIds.size) {
          const scheduleRows = await AppDataSource.getRepository(Schedule).find({
            where: { teacher: { id: teacher.id } },
            relations: { group: true },
          });
          scheduleRows.forEach((row) => groupIds.add(row.group.id));
        }

        if (!groupIds.size) {
          return res.json([]);
        }

        const students = await studentRepository.find({
          where: Array.from(groupIds).map((groupId) => ({ group: { id: groupId } })),
          relations: {
            user: true,
            group: true,
          },
        });

        return res.json(students);
      }

      return res.status(403).json({
        message: "Нет доступа",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Get students error",
      });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as { user?: { id: number } }).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const student = await AppDataSource.getRepository(Student).findOne({
        where: { user: { id: userId } },
        relations: { user: true, group: true },
      });

      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      return res.json(student);
    } catch (error) {
      return res.status(500).json({ message: "Get student profile error" });
    }
  }

  static async getMySubjects(req: Request, res: Response) {
    try {
      const userId = (req as { user?: { id: number } }).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const student = await AppDataSource.getRepository(Student).findOne({
        where: { user: { id: userId } },
        relations: { group: true },
      });

      if (!student) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      const schedules = await AppDataSource.getRepository(Schedule).find({
        where: { group: { id: student.group.id } },
        relations: { subject: true },
      });

      const map = new Map<number, { id: number; name: string }>();
      schedules.forEach((s) => {
        if (s.subject) {
          map.set(s.subject.id, { id: s.subject.id, name: s.subject.name });
        }
      });

      return res.json(Array.from(map.values()));
    } catch (error) {
      return res.status(500).json({ message: "Get student subjects error" });
    }
  }

  static async getOne(
    req: Request,
    res: Response
  ) {
    try {
      const { id } = req.params;

      const studentRepository =
        AppDataSource.getRepository(Student);

      const student =
        await studentRepository.findOne({
          where: {
            id: Number(id),
          },
          relations: {
            user: true,
            group: true,
          },
        });

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      return res.json(student);
    } catch (error) {
      return res.status(500).json({
        message: "Get student error",
      });
    }
  }

  static async create(
    req: Request,
    res: Response
  ) {
    try {
      const {
        userId,
        groupId,
        fullName,
        login,
        password,
        expelled,
        isNew,
      } = req.body;

      const studentRepository =
        AppDataSource.getRepository(Student);

      const userRepository =
        AppDataSource.getRepository(User);

      const groupRepository =
        AppDataSource.getRepository(Group);

      const group =
        await groupRepository.findOne({
          where: {
            id: Number(groupId),
          },
        });

      if (!group) {
        return res.status(404).json({
          message: "Group not found",
        });
      }

      let user: User | null = null;

      if (userId) {
        user = await userRepository.findOne({
          where: { id: Number(userId) },
        });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
      } else if (fullName && login && password) {
        const existing = await userRepository.findOne({
          where: { login },
        });
        if (existing) {
          return res.status(400).json({ message: "Login already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 5);
        user = userRepository.create({
          fullName,
          login,
          password: hashedPassword,
          role: UserRole.STUDENT,
        });
        await userRepository.save(user);
      } else {
        return res.status(400).json({
          message: "Provide userId or fullName, login, password with groupId",
        });
      }

      const existingStudent = await studentRepository.findOne({
        where: { user: { id: user.id } },
        relations: { user: true },
      });
      if (existingStudent) {
        return res.status(400).json({ message: "Student profile already exists" });
      }

      const student = studentRepository.create({
        user,
        group,
        expelled: expelled ?? false,
        isNew: isNew ?? true,
      });

      await studentRepository.save(student);

      const saved = await studentRepository.findOne({
        where: { id: student.id },
        relations: { user: true, group: true },
      });

      return res.status(201).json(saved);
    } catch (error) {
      return res.status(500).json({
        message: "Create student error",
      });
    }
  }

  static async update(
    req: Request,
    res: Response
  ) {
    try {
      const { id } = req.params;

      const {
        fullName,
        login,
        groupId,
        expelled,
        isNew,
      } = req.body;

      const studentRepository =
        AppDataSource.getRepository(Student);

      const student =
        await studentRepository.findOne({
          where: {
            id: Number(id),
          },
          relations: { user: true, group: true },
        });

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      if (fullName !== undefined) student.user.fullName = fullName;
      if (login !== undefined) student.user.login = login;
      if (groupId !== undefined) {
        const group = await AppDataSource.getRepository(Group).findOneBy({
          id: Number(groupId),
        });
        if (!group) {
          return res.status(404).json({ message: "Group not found" });
        }
        student.group = group;
      }
      if (expelled !== undefined) student.expelled = expelled;
      if (isNew !== undefined) student.isNew = isNew;

      await AppDataSource.getRepository(User).save(student.user);
      await studentRepository.save(student);

      const saved = await studentRepository.findOne({
        where: { id: student.id },
        relations: { user: true, group: true },
      });

      return res.json(saved);
    } catch (error) {
      return res.status(500).json({
        message: "Update student error",
      });
    }
  }

  static async delete(
    req: Request,
    res: Response
  ) {
    try {
      const { id } = req.params;

      const studentRepository =
        AppDataSource.getRepository(Student);

      const student =
        await studentRepository.findOne({
          where: {
            id: Number(id),
          },
        });

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      await studentRepository.remove(student);

      return res.json({
        message: "Student deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Delete student error",
      });
    }
  }
}