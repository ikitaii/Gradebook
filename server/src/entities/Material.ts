import {
  Entity,
 PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { Subject } from "./Subject";
import { Lab } from "./Lab";
import { Teacher } from "./Teacher";

@Entity()
export class Material {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  fileUrl!: string;

  @ManyToOne(() => Subject, {
    nullable: true,
  })
  subject!: Subject;

  @ManyToOne(() => Lab, {
    nullable: true,
  })
  lab!: Lab;

  @ManyToOne(() => Teacher)
  uploadedBy!: Teacher;

  @CreateDateColumn()
  createdAt!: Date;
}