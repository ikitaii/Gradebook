import { Request, Response } from "express";

import { AppDataSource } from "../database/data-source";

import { Group } from "../entities/Group";

export class GroupController {
  static async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const groupRepository =
        AppDataSource.getRepository(Group);

      const groups =
        await groupRepository.find({
          relations: {
            students: true,
          },
        });

      return res.json(groups);
    } catch (error) {
      return res.status(500).json({
        message: "Get groups error",
      });
    }
  }

  static async getOne(
    req: Request,
    res: Response
  ) {
    try {
      const { id } = req.params;

      const groupRepository =
        AppDataSource.getRepository(Group);

      const group =
        await groupRepository.findOne({
          where: {
            id: Number(id),
          },
          relations: {
            students: true,
          },
        });

      if (!group) {
        return res.status(404).json({
          message: "Group not found",
        });
      }

      return res.json(group);
    } catch (error) {
      return res.status(500).json({
        message: "Get group error",
      });
    }
  }

  static async create(
    req: Request,
    res: Response
  ) {
    try {
      const { name } = req.body;

      const groupRepository =
        AppDataSource.getRepository(Group);

      const candidate =
        await groupRepository.findOne({
          where: {
            name,
          },
        });

      if (candidate) {
        return res.status(400).json({
          message:
            "Group already exists",
        });
      }

      const group =
        groupRepository.create({
          name,
        });

      await groupRepository.save(group);

      return res.status(201).json(group);
    } catch (error) {
      return res.status(500).json({
        message: "Create group error",
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

      const groupRepository =
        AppDataSource.getRepository(Group);

      const group =
        await groupRepository.findOne({
          where: {
            id: Number(id),
          },
        });

      if (!group) {
        return res.status(404).json({
          message: "Group not found",
        });
      }

      group.name = name;

      await groupRepository.save(group);

      return res.json(group);
    } catch (error) {
      return res.status(500).json({
        message: "Update group error",
      });
    }
  }

  static async delete(
    req: Request,
    res: Response
  ) {
    try {
      const { id } = req.params;

      const groupRepository =
        AppDataSource.getRepository(Group);

      const group =
        await groupRepository.findOne({
          where: {
            id: Number(id),
          },
        });

      if (!group) {
        return res.status(404).json({
          message: "Group not found",
        });
      }

      await groupRepository.remove(group);

      return res.json({
        message: "Group deleted",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Delete group error",
      });
    }
  }
}