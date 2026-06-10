import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { Subject } from "./Subject";

export enum ProgramItemType {
  LAB = "LAB",
  THEORY = "THEORY",
  PRACTICE = "PRACTICE",
  TEST = "TEST",
}

@Entity()
export class ProgramItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => Subject
  )
  subject!: Subject;

  @Column()
  title!: string;

  @Column({
    type: "text",
  })
  description!: string;

  @Column({
    type: "varchar",
  })
  type!: ProgramItemType;

  @Column({
    nullable: true,
  })
  materialUrl!: string;

  @Column({
    type: "datetime",
    nullable: true,
  })
  deadline!: Date;

  @Column({
    default: false,
  })
  teamWork!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}