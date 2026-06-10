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
import { ProgramItem } from "../entities/ProgramItem";

export const AppDataSource = new DataSource({
  type: "sqlite",

  database: "database.sqlite",

  synchronize: true,

  logging: false,

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
    ProgramItem,
  ],
});