import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";

import { TeacherSubject } from "./TeacherSubject";

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  name!: string;

  @OneToMany(
    () => TeacherSubject,
    (teacherSubject) => teacherSubject.subject
  )
  teacherSubjects!: TeacherSubject[];
}