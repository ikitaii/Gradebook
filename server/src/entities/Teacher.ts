import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

import { User } from "./User";
import { TeacherSubject } from "./TeacherSubject";
import { Lab } from "./Lab";
import { Comment } from "./Comment";
@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @OneToMany(
    () => TeacherSubject,
    (teacherSubject) => teacherSubject.teacher
  )
  teacherSubjects!: TeacherSubject[];
  @OneToMany(() => Lab, (lab) => lab.teacher)
labs!: Lab[];

@OneToMany(() => Comment, (comment) => comment.teacher)
comments!: Comment[];
}