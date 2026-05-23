import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from "typeorm";

import { Lesson } from "./Lesson";
import { Student } from "./Student";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => Lesson,
    (lesson) => lesson.attendances
  )
  lesson!: Lesson;

  @ManyToOne(() => Student)
  student!: Student;

  @Column({
    type: "varchar",
  })
  status!: AttendanceStatus;
}