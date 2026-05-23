import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { Subject } from "./Subject";

export enum ProgramType {
  LECTURE = "LECTURE",
  LAB = "LAB",
  PRACTICE = "PRACTICE",
  TEST = "TEST",
  EXAM = "EXAM",
}

@Entity()
export class SubjectProgram {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Subject)
  subject!: Subject;

  @Column()
  title!: string;

  @Column({
    type: "text",
  })
  description!: string;

  @Column({
    type: "varchar",
  })
  type!: ProgramType;

  @Column()
  weekOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;
}