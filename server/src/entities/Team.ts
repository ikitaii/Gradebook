import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  CreateDateColumn,
} from "typeorm";

import { Student } from "./Student";
import { Lab } from "./Lab";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Lab, { nullable: true })
  lab!: Lab | null;

  @ManyToMany(() => Student)
  @JoinTable()
  students!: Student[];

  @CreateDateColumn()
  createdAt!: Date;
}