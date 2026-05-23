import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from "typeorm";

import { Teacher } from "./Teacher";
import { Student } from "./Student";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Teacher)
  teacher!: Teacher;

  @ManyToOne(() => Student)
  student!: Student;

  @Column({
    type: "text",
  })
  text!: string;

  @CreateDateColumn()
  createdAt!: Date;
}