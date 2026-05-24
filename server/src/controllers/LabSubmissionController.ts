import { Request, Response } from "express";
import { LabSubmissionService } from "../services/LabSubmissionServices";

export class LabSubmissionController {
  static async submit(req: Request, res: Response) {
    const file = req.file;

    const submission = await LabSubmissionService.submit({
      ...req.body,
      fileUrl: file?.path,
    });

    res.json(submission);
  }

  static async getAll(req: Request, res: Response) {
    const data = await LabSubmissionService.getAll();
    res.json(data);
  }
  static async check(req: Request, res: Response) {
  const id = req.params.id as string;

  const updated = await LabSubmissionService.check(id, req.body);

  res.json(updated);
}
}