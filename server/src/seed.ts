import bcrypt from "bcrypt";

import { AppDataSource } from "./src/database/data-source";

import {
  User,
  UserRole,
} from "./src/entities/User";

import { Student } from "./src/entities/Student";

import { Teacher } from "./src/entities/Teacher";

import { Group } from "./src/entities/Group";

import { Subject } from "./src/entities/Subject";

import { Lesson } from "./src/entities/Lesson";

import { Grade } from "./src/entities/Grade";

import {
  Attendance,
  AttendanceStatus,
} from "./src/entities/Attendance";

async function seed() {
  await AppDataSource.initialize();

  console.log(
    "DATABASE CONNECTED"
  );

  const userRepo =
    AppDataSource.getRepository(
      User
    );

  const groupRepo =
    AppDataSource.getRepository(
      Group
    );

  const subjectRepo =
    AppDataSource.getRepository(
      Subject
    );

  const teacherRepo =
    AppDataSource.getRepository(
      Teacher
    );

  const studentRepo =
    AppDataSource.getRepository(
      Student
    );

  const lessonRepo =
    AppDataSource.getRepository(
      Lesson
    );

  const gradeRepo =
    AppDataSource.getRepository(
      Grade
    );

  const attendanceRepo =
    AppDataSource.getRepository(
      Attendance
    );

  await attendanceRepo.clear();

  await gradeRepo.clear();

  await lessonRepo.clear();

  await studentRepo.clear();

  await teacherRepo.clear();

  await subjectRepo.clear();

  await groupRepo.clear();

  await userRepo.clear();

  const admin =
    userRepo.create({
      fullName:
        "Администратор",

      login: "admin",

      password:
        await bcrypt.hash(
          "admin123",
          10
        ),

      role:
        UserRole.ADMIN,
    });

  await userRepo.save(
    admin
  );

  const teacherUser1 =
    userRepo.create({
      fullName:
        "Иванов И.И.",

      login:
        "teacher1",

      password:
        await bcrypt.hash(
          "teacher1",
          10
        ),

      role:
        UserRole.TEACHER,
    });

  const teacherUser2 =
    userRepo.create({
      fullName:
        "Петров А.А.",

      login:
        "teacher2",

      password:
        await bcrypt.hash(
          "teacher2",
          10
        ),

      role:
        UserRole.TEACHER,
    });

  const teacherUser3 =
    userRepo.create({
      fullName:
        "Сидоров В.В.",

      login:
        "teacher3",

      password:
        await bcrypt.hash(
          "teacher3",
          10
        ),

      role:
        UserRole.TEACHER,
    });

  await userRepo.save([
    teacherUser1,
    teacherUser2,
    teacherUser3,
  ]);

  const group1 =
    groupRepo.create({
      name: "Т-394",
    });

  const group2 =
    groupRepo.create({
      name: "ИС-221",
    });

  await groupRepo.save([
    group1,
    group2,
  ]);

  const subject1 =
    subjectRepo.create({
      name: "React",
    });

  const subject2 =
    subjectRepo.create({
      name:
        "TypeScript",
    });

  const subject3 =
    subjectRepo.create({
      name:
        "Базы данных",
    });

  await subjectRepo.save([
    subject1,
    subject2,
    subject3,
  ]);

  const teacher1 =
    teacherRepo.create({
      user:
        teacherUser1,
    });

  const teacher2 =
    teacherRepo.create({
      user:
        teacherUser2,
    });

  const teacher3 =
    teacherRepo.create({
      user:
        teacherUser3,
    });

  await teacherRepo.save([
    teacher1,
    teacher2,
    teacher3,
  ]);

  const students:
    Student[] = [];

  for (
    let i = 1;
    i <= 50;
    i++
  ) {
    const user =
      userRepo.create({
        fullName:
          `Студент ${i}`,

        login:
          `student${i}`,

        password:
          await bcrypt.hash(
            `student${i}`,
            10
          ),

        role:
          UserRole.STUDENT,
      });

    await userRepo.save(
      user
    );

    const student =
      studentRepo.create({
        user,

        group:
          i <= 25
            ? group1
            : group2,

        expelled: false,

        isNew: false,
      });

    await studentRepo.save(
      student
    );

    students.push(
      student
    );
  }

  const lessons:
    Lesson[] = [];

  for (
    let i = 1;
    i <= 15;
    i++
  ) {
    const lesson =
      lessonRepo.create({
        lessonDate:
          new Date(),

        topic:
          `Тема ${i}`,

        subject:
          i % 3 === 0
            ? subject3
            : i % 2 === 0
            ? subject2
            : subject1,

        teacher:
          i % 3 === 0
            ? teacher3
            : i % 2 === 0
            ? teacher2
            : teacher1,

        group:
          i <= 8
            ? group1
            : group2,
      });

    await lessonRepo.save(
      lesson
    );

    lessons.push(
      lesson
    );
  }

  for (
    const student of students
  ) {
    for (
      const lesson of lessons
    ) {
      const grade =
        gradeRepo.create({
          value:
            Math.floor(
              Math.random() *
                4
            ) + 7,

          student,

          lesson,
        });

      await gradeRepo.save(
        grade
      );

      const statuses =
        [
          AttendanceStatus.PRESENT,
          AttendanceStatus.ABSENT,
          AttendanceStatus.LATE,
        ];

      const attendance =
        attendanceRepo.create({
          status:
            statuses[
              Math.floor(
                Math.random() *
                  statuses.length
              )
            ],

          student,

          lesson,
        });

      await attendanceRepo.save(
        attendance
      );
    }
  }

  console.log(
    "SEED COMPLETED"
  );

  console.log(
    "ADMIN:"
  );

  console.log(
    "admin / admin"
  );

  console.log(
    "TEACHERS:"
  );

  console.log(
    "teacher1 / teacher1"
  );

  console.log(
    "teacher2 / teacher2"
  );

  console.log(
    "teacher3 / teacher3"
  );

  console.log(
    "STUDENTS:"
  );

  console.log(
    "student1 / student1"
  );

  console.log(
    "student25 / student25"
  );

  console.log(
    "student50 / student50"
  );

  process.exit();
}

seed();