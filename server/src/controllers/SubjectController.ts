import { Request, Response } from "express";

import { AppDataSource } from "../database/data-source";

import { Subject } from "../entities/Subject";

export class SubjectController {
  static async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const subjectRepository =
        AppDataSource.getRepository(Subject);

      const subjects =
        await subjectRepository.find();

      return res.json(subjects);
    } catch (error) {
      return res.status(500).json({
        message: "Get subjects error",
      });
    }
  }

  static async getOne(
    req: Request,
    res: Response
  ) {
    try {
      const { id } = req.params;

      const subjectRepository =
        AppDataSource.getRepository(Subject);

      const subject =
        await subjectRepository.findOne({
          where: {
            id: Number(id),
          },
        });

      if (!subject) {
        return res.status(404).json({
          message: "Subject not found",
        });
      }

      return res.json(subject);
    } catch (error) {
      return res.status(500).json({
        message: "Get subject error",
      });
    }
  }

  static async create(
    req: Request,
    res: Response
  ) {
    try {
      const { name } = req.body;

      const subjectRepository =
        AppDataSource.getRepository(Subject);

      const candidate =
        await subjectRepository.findOne({
          where: {
            name,
          },
        });

      if (candidate) {
        return res.status(400).json({
          message:
            "Subject already exists",
        });
      }

      const subject =
        subjectRepository.create({
          name,
        });

      await subjectRepository.save(subject);

      return res.status(201).json(subject);
    } catch (error) {
      return res.status(500).json({
        message: "Create subject error",
      });
    }
  }

  static async update(
    req: Request,
    res: Response
  ) {
    try {
      const { id } = req.params;

      const { name } = req.body;

      const subjectRepository =
        AppDataSource.getRepository(Subject);

      const subject =
        await subjectRepository.findOne({
          where: {
            id: Number(id),
          },
        });

      if (!subject) {
        return res.status(404).json({
          message: "Subject not found",
        });
      }

      subject.name = name;

      await subjectRepository.save(subject);

      return res.json(subject);
    } catch (error) {
      return res.status(500).json({
        message: "Update subject error",
      });
    }
  }

  static async delete(
    req: Request,
    res: Response
  ) {
    try {
      const { id } = req.params;

      const subjectRepository =
        AppDataSource.getRepository(Subject);

      const subject =
        await subjectRepository.findOne({
          where: {
            id: Number(id),
          },
        });

      if (!subject) {
        return res.status(404).json({
          message: "Subject not found",
        });
      }

      await subjectRepository.remove(subject);

      return res.json({
        message: "Subject deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Delete subject error",
      });
    }
  }
}