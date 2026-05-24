import { Request, Response } from "express";
import { LabService } from "../services/LabService";

export class LabController {
  static async create(req: Request, res: Response) {
    const lab = await LabService.create(req.body);
    res.json(lab);
  }

  static async getAll(req: Request, res: Response) {
    const labs = await LabService.getAll();
    res.json(labs);
  }
}