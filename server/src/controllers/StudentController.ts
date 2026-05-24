import { Request, Response } from "express";

import { AppDataSource } from "../database/data-source";

import { Student } from "../entities/Student";

import { User } from "../entities/User";

import { Group } from "../entities/Group";

export class StudentController {
  static async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const studentRepository =
        AppDataSource.getRepository(Student);

      const students =
        await studentRepository.find({
          relations: {
            user: true,
            group: true,
          },
        });

      return res.json(students);
    } catch (error) {
      return res.status(500).json({
        message: "Get students error",
      });
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
        expelled,
        isNew,
      } = req.body;

      const studentRepository =
        AppDataSource.getRepository(Student);

      const userRepository =
        AppDataSource.getRepository(User);

      const groupRepository =
        AppDataSource.getRepository(Group);

      const user =
        await userRepository.findOne({
          where: {
            id: userId,
          },
        });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const group =
        await groupRepository.findOne({
          where: {
            id: groupId,
          },
        });

      if (!group) {
        return res.status(404).json({
          message: "Group not found",
        });
      }

      const student =
        studentRepository.create({
          user,
          group,
          expelled,
          isNew,
        });

      await studentRepository.save(student);

      return res.status(201).json(student);
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
        });

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      student.expelled = expelled;
      student.isNew = isNew;

      await studentRepository.save(student);

      return res.json(student);
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