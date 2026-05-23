import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from "typeorm";
import { Team } from "./Team";
import { Lab } from "./Lab";
import { Student } from "./Student";

export enum SubmissionStatus {
  SUBMITTED = "SUBMITTED",
  CHECKED = "CHECKED",
  REVISION = "REVISION",
  OVERDUE = "OVERDUE",
}

@Entity()
export class LabSubmission {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => Lab,
    (lab) => lab.submissions
  )
  lab!: Lab;

  @ManyToOne(() => Team)
  team!: Team;

  @Column()
  fileUrl!: string;

  @Column({
    type: "varchar",
  })
  status!: SubmissionStatus;

  @Column({
    nullable: true,
  })
  grade!: string;

  @CreateDateColumn()
  submittedAt!: Date;
}