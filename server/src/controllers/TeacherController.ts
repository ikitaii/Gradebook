import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User, UserRole } from "../entities/User";
import { AuthRequest } from "../middlewares/authMiddleware";

export class TeacherController {
  static async getMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: userId, role: UserRole.TEACHER },
        relations: { teacher: true },
      });
      if (!user?.teacher) {
        return res.status(404).json({ message: "Профиль преподавателя не найден" });
      }
      return res.json({ id: user.teacher.id, fullName: user.fullName });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка получения профиля" });
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const teachers = await AppDataSource.getRepository(User).find({
        where: { role: UserRole.TEACHER },
        relations: { teacher: true },
        order: { fullName: "ASC" },
      });

      return res.json(
        teachers
          .filter((u) => u.teacher)
          .map((u) => ({
            id: u.teacher.id,
            fullName: u.fullName,
          }))
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка получения преподавателей" });
    }
  }
}
