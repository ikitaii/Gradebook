import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from "typeorm";

import { Student } from "./Student";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToMany(() => Student)
  @JoinTable()
  students!: Student[];

  @CreateDateColumn()
  createdAt!: Date;
}