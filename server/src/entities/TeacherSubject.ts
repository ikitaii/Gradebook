import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";

import { Teacher } from "./Teacher";
import { Subject } from "./Subject";
import { Group } from "./Group";

@Entity()
export class TeacherSubject {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => Teacher,
    (teacher) => teacher.teacherSubjects
  )
  teacher!: Teacher;

  @ManyToOne(
    () => Subject,
    (subject) => subject.teacherSubjects
  )
  subject!: Subject;

  @ManyToOne(() => Group)
  group!: Group;
}