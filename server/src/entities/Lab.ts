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
import { Lesson } from "./Lesson";

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

  @Column({
    nullable: true,
  })
  materialUrl!: string;

  @Column({
    type: "datetime",
    nullable: true,
  })
  issuedAt!: Date;

  @ManyToOne(() => Subject)
  subject!: Subject;

  @ManyToOne(() => Teacher)
  teacher!: Teacher;

  @ManyToOne(() => Lesson)
  lesson!: Lesson;

  @OneToMany(
    () => LabSubmission,
    (submission) => submission.lab
  )
  submissions!: LabSubmission[];

  @CreateDateColumn()
  createdAt!: Date;
}