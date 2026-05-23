import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from "typeorm";

import { Student } from "./Student";
import { Teacher } from "./Teacher";

export enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({
    unique: true,
  })
  login!: string;

  @Column()
  password!: string;

  @Column({
    type: "varchar",
  })
  role!: UserRole;

  @OneToOne(() => Student, (student) => student.user)
  student!: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher!: Teacher;

  @CreateDateColumn()
  createdAt!: Date;
}