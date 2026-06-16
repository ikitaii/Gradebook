import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import { User, UserRole } from "../entities/User";
import { Student } from "../entities/Student";

export const verifyStudentAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as { user?: User }).user;

    const studentId = Number(req.params.id);
    if (!Number.isInteger(studentId)) {
      return res.status(400).json({ message: "Invalid student id" });
    }

    if (user?.role === UserRole.STUDENT) {
      const student = await AppDataSource.getRepository(Student).findOne({
        where: { user: { id: user.id } },
      });
      if (!student || student.id !== studentId) {
        return res.status(403).json({
          message: "Access denied: students can only view their own grades",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Error in verifyStudentAccess middleware:", error);
    return res.status(500).json({ message: "Access verification error" });
  }
};
