import "reflect-metadata";
import "reflect-metadata";

import dotenv from "dotenv";

dotenv.config();

import { DataSource } from "typeorm";

import { User } from "../entities/User";
import { Student } from "../entities/Student";
import { Teacher } from "../entities/Teacher";
import { Group } from "../entities/Group";
import { Subject } from "../entities/Subject";
import { TeacherSubject } from "../entities/TeacherSubject";
import { Lesson } from "../entities/Lesson";
import { Attendance } from "../entities/Attendance";
import { Grade } from "../entities/Grade";
import { Lab } from "../entities/Lab";
import { LabSubmission } from "../entities/LabSubmission";
import { Comment } from "../entities/Comment";
import { Material } from "../entities/Material";
import { Schedule } from "../entities/Schedule";
import { Team } from "../entities/Team";
import { SubjectProgram } from "../entities/SubjectProgram";

console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_USER);
console.log(process.env.DB_NAME);

export const AppDataSource = new DataSource({
  type: "mssql",

  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT),

  username: process.env.DB_USER,

password: process.env.DB_PASSWORD,

database: process.env.DB_NAME,

  synchronize: true,

  logging: true,

  entities: [
    User,
    Student,
    Teacher,
    Group,
    Subject,
    TeacherSubject,
    Lesson,
    Attendance,
    Grade,
    Lab,
    LabSubmission,
    Comment,
    Material,
    Schedule,
    Team,
    SubjectProgram,
  ],

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});