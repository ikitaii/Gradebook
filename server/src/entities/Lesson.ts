import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";

import { Subject } from "./Subject";
import { Teacher } from "./Teacher";
import { Group } from "./Group";
import { Attendance } from "./Attendance";
import { Grade } from "./Grade";

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Subject)
  subject!: Subject;

  @ManyToOne(() => Teacher)
  teacher!: Teacher;

  @ManyToOne(() => Group)
  group!: Group;

  @Column({
    type: "datetime",
  })
  lessonDate!: Date;

  @Column()
  topic!: string;

  @OneToMany(
    () => Attendance,
    (attendance) => attendance.lesson
  )
  attendances!: Attendance[];

  @OneToMany(
    () => Grade,
    (grade) => grade.lesson
  )
  grades!: Grade[];

  @CreateDateColumn()
  createdAt!: Date;
}