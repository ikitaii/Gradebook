import {
  Entity,
 PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from "typeorm";

import { Lesson } from "./Lesson";
import { Student } from "./Student";

@Entity()
export class Grade {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => Lesson,
    (lesson) => lesson.grades
  )
  lesson!: Lesson;

  @ManyToOne(() => Student)
  student!: Student;

  @Column()
  value!: number;
}