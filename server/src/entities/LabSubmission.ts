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
  PENDING = "PENDING",
  CHECKED = "CHECKED",
  REVISION = "REVISION",
  LATE = "LATE",
}

@Entity()
export class LabSubmission {
  @PrimaryGeneratedColumn()
  id!: number;
 
  @ManyToOne(() => Lab, (lab) => lab.submissions)
  lab!: Lab;
 
  @ManyToOne(() => Student)
  student!: Student;
 
  @ManyToOne(() => Team, { nullable: true })
  team?: Team;

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