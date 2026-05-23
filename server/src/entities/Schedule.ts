import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
} from "typeorm";

import { Group } from "./Group";
import { Subject } from "./Subject";
import { Teacher } from "./Teacher";

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Group)
  group!: Group;

  @ManyToOne(() => Subject)
  subject!: Subject;

  @ManyToOne(() => Teacher)
  teacher!: Teacher;

  @Column()
  dayOfWeek!: string;

  @Column()
  startTime!: string;

  @Column()
  endTime!: string;

  @Column()
  room!: string;
}