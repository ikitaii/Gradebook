import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";

import { Subject } from "./Subject";
import { Teacher } from "./Teacher";
import { LabSubmission } from "./LabSubmission";

@Entity()
export class Lab {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({
    type: "text",
  })
  description!: string;

  @Column({
    type: "datetime",
  })
  deadline!: Date;

  @ManyToOne(() => Subject)
  subject!: Subject;

  @ManyToOne(() => Teacher)
  teacher!: Teacher;

  @OneToMany(
    () => LabSubmission,
    (submission) => submission.lab
  )
  submissions!: LabSubmission[];

  @CreateDateColumn()
  createdAt!: Date;
}