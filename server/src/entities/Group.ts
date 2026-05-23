import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";

import { Student } from "./Student";

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  name!: string;

  @OneToMany(() => Student, (student) => student.group)
  students!: Student[];
}