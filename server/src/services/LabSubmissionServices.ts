import { AppDataSource } from "../database/data-source";
import { LabSubmission } from "../entities/LabSubmission";
import { Lab } from "../entities/Lab";
import { Grade } from "../entities/Grade";
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
  const submission = await repo.findOne({
    where: { id: Number(id) },
    relations: ["student", "lab"],
  });

  if (!submission) {
    throw new Error("Submission not found");
  }
  await repo.update(id, {
    ...data,
    status: "CHECKED",
  });
  const gradeRepo = AppDataSource.getRepository(Grade);

  await gradeRepo.save({
    value: data.grade,
    student: { id: (submission.student as any).id },
    lesson: { id: submission.lab.lesson.id },
  });

  return repo.findOneBy({ id: Number(id) });
}
}