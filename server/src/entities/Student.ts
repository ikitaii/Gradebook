import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
  Column,
} from "typeorm";
import { Attendance } from "./Attendance";
import { Grade } from "./Grade";
import { User } from "./User";
import { Group } from "./Group";
import { LabSubmission } from "./LabSubmission";
import { Comment } from "./Comment";
@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    default: false,
  })
  expelled!: boolean;

  @Column({
    default: true,
  })
  isNew!: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Group, (group) => group.students)
  group!: Group;
  @OneToMany(
  () => Attendance,
  (attendance) => attendance.student
)
attendances!: Attendance[];

@OneToMany(
  () => Grade,
  (grade) => grade.student
)
grades!: Grade[];

@OneToMany(
  () => Comment,
  (comment) => comment.student
)
comments!: Comment[];
}