import { AppDataSource } from "../database/data-source";
import { Lab } from "../entities/Lab";

const repo = AppDataSource.getRepository(Lab);

export class LabService {
  static async create(data: Partial<Lab>) {
    const lab = repo.create(data);
    return repo.save(lab);
  }

  static async getAll() {
    return repo.find();
  }
}