import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { Student } from "./Student";

import { Lab } from "./Lab";

@Entity()
export class LabSubmission {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => Student
  )
  student!: Student;

  @ManyToOne(
    () => Lab
  )
  lab!: Lab;

  @Column()
  fileUrl!: string;

  @Column({
    nullable: true,
  })
  grade!: number;

  @Column({
    type: "text",
    nullable: true,
  })
  comment!: string;

  @Column({
    default: false,
  })
  checked!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}