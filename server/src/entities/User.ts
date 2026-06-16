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
  ADMIN = "ADMIN",
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
    type: "simple-enum",
    enum: UserRole,
  })
  role!: UserRole;

  @OneToOne(() => Student, (student) => student.user)
  student!: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher!: Teacher;

  @CreateDateColumn()
  createdAt!: Date;
}