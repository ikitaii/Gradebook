import { AppDataSource } from "../database/data-source";
import { LabSubmission } from "../entities/LabSubmission";
import { Lab } from "../entities/Lab";

const repo = AppDataSource.getRepository(LabSubmission);

export class LabSubmissionService {
 
  static async submit(data: any) {
    const labRepo = AppDataSource.getRepository(Lab);

    const lab = await labRepo.findOneBy({ id: data.labId });

    if (!lab) {
      throw new Error("Lab not found");
    }

    const isLate = new Date() > new Date(lab.deadline);

    const submission = repo.create({
      ...data,
      status: isLate ? "LATE" : "PENDING",
      lab: { id: data.labId },        
      student: { id: data.studentId }  
    });

    return repo.save(submission);
  }
 
  static async getAll(labId?: number) {
    if (labId) {
      return repo.find({
        where: {
          lab: { id: labId },
        },
      });
    }

    return repo.find();
  }
 
  static async check(id: string, data: any) {
    await repo.update(id, {
      ...data,
      status: "CHECKED",
    });

    return repo.findOneBy({ id: Number(id) });
  }
}