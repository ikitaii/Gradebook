import bcrypt from "bcrypt";
import { AppDataSource } from "./database/data-source";
import { User, UserRole } from "./entities/User";
import { Student } from "./entities/Student";
import { Teacher } from "./entities/Teacher";
import { Group } from "./entities/Group";
import { Subject } from "./entities/Subject";
import { Lesson } from "./entities/Lesson";
import { Grade } from "./entities/Grade";
import { Attendance, AttendanceStatus } from "./entities/Attendance";
import { Schedule } from "./entities/Schedule";
import { Lab } from "./entities/Lab";
import { LabSubmission } from "./entities/LabSubmission";
import { TeacherSubject } from "./entities/TeacherSubject";
import { ProgramItem, ProgramItemType } from "./entities/ProgramItem";
import { Team } from "./entities/Team";

const SUBJECT_NAMES = [
  "ПСС",
  "WEBДизайн",
  "КПиЯП",
  "Практика",
  "ТестированиеПО",
  "Комп Сети",
  "ВебПрогр",
];

const WEEKDAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
];

async function seed() {
  await AppDataSource.initialize();
  console.log("DATABASE CONNECTED");

  const userRepo = AppDataSource.getRepository(User);
  const groupRepo = AppDataSource.getRepository(Group);
  const subjectRepo = AppDataSource.getRepository(Subject);
  const teacherRepo = AppDataSource.getRepository(Teacher);
  const studentRepo = AppDataSource.getRepository(Student);
  const lessonRepo = AppDataSource.getRepository(Lesson);
  const gradeRepo = AppDataSource.getRepository(Grade);
  const attendanceRepo = AppDataSource.getRepository(Attendance);
  const scheduleRepo = AppDataSource.getRepository(Schedule);
  const labRepo = AppDataSource.getRepository(Lab);
  const labSubmissionRepo = AppDataSource.getRepository(LabSubmission);
  const teacherSubjectRepo = AppDataSource.getRepository(TeacherSubject);
  const programRepo = AppDataSource.getRepository(ProgramItem);
  const teamRepo = AppDataSource.getRepository(Team);

  await labSubmissionRepo.clear();
  await attendanceRepo.clear();
  await gradeRepo.clear();
  await teamRepo.clear();
  await labRepo.clear();
  await lessonRepo.clear();
  await scheduleRepo.clear();
  await programRepo.clear();
  await teacherSubjectRepo.clear();
  await studentRepo.clear();
  await teacherRepo.clear();
  await subjectRepo.clear();
  await groupRepo.clear();
  await userRepo.clear();

  const admin = userRepo.create({
    fullName: "Администратор",
    login: "admin",
    password: await bcrypt.hash("admin123", 10),
    role: UserRole.ADMIN,
  });
  await userRepo.save(admin);

  const teacherUsers = await userRepo.save([
    userRepo.create({
      fullName: "Иванов И.И.",
      login: "teacher1",
      password: await bcrypt.hash("teacher1", 10),
      role: UserRole.TEACHER,
    }),
    userRepo.create({
      fullName: "Петров А.А.",
      login: "teacher2",
      password: await bcrypt.hash("teacher2", 10),
      role: UserRole.TEACHER,
    }),
    userRepo.create({
      fullName: "Сидоров В.В.",
      login: "teacher3",
      password: await bcrypt.hash("teacher3", 10),
      role: UserRole.TEACHER,
    }),
  ]);

  const [group1, group2] = await groupRepo.save([
    groupRepo.create({ name: "Т-394" }),
    groupRepo.create({ name: "ИС-221" }),
  ]);

  const subjects = await subjectRepo.save(
    SUBJECT_NAMES.map((name) => subjectRepo.create({ name }))
  );

  const teachers = await teacherRepo.save(
    teacherUsers.map((u) => teacherRepo.create({ user: u }))
  );

  const students: Student[] = [];
  for (let i = 1; i <= 50; i++) {
    const user = await userRepo.save(
      userRepo.create({
        fullName: `Студент ${i}`,
        login: `student${i}`,
        password: await bcrypt.hash(`student${i}`, 10),
        role: UserRole.STUDENT,
      })
    );
    const student = await studentRepo.save(
      studentRepo.create({
        user,
        group: i <= 25 ? group1 : group2,
        expelled: i === 50,
        isNew: i >= 48,
      })
    );
    students.push(student);
  }

  // Назначения преподавателей
  const assignments = [
    { teacher: teachers[0], subject: subjects[0], group: group1 },
    { teacher: teachers[0], subject: subjects[6], group: group1 },
    { teacher: teachers[1], subject: subjects[1], group: group1 },
    { teacher: teachers[1], subject: subjects[2], group: group2 },
    { teacher: teachers[1], subject: subjects[3], group: group2 },
    { teacher: teachers[2], subject: subjects[4], group: group1 },
    { teacher: teachers[2], subject: subjects[5], group: group2 },
    { teacher: teachers[0], subject: subjects[6], group: group2 },
  ];
  await teacherSubjectRepo.save(
    assignments.map((a) =>
      teacherSubjectRepo.create({
        teacher: a.teacher,
        subject: a.subject,
        group: a.group,
      })
    )
  );

  // Расписание (глобальное)
  const scheduleSlots = [
    { day: "Понедельник", start: "09:00", end: "10:30", room: "301" },
    { day: "Понедельник", start: "10:45", end: "12:15", room: "302" },
    { day: "Вторник", start: "09:00", end: "10:30", room: "201" },
    { day: "Среда", start: "12:15", end: "13:45", room: "401" },
    { day: "Четверг", start: "14:15", end: "15:45", room: "105" },
    { day: "Пятница", start: "09:00", end: "10:30", room: "303" },
  ];

  for (let i = 0; i < scheduleSlots.length; i++) {
    const slot = scheduleSlots[i];
    const assignment = assignments[i % assignments.length];
    await scheduleRepo.save(
      scheduleRepo.create({
        dayOfWeek: slot.day,
        startTime: slot.start,
        endTime: slot.end,
        room: slot.room,
        group: assignment.group,
        subject: assignment.subject,
        teacher: assignment.teacher,
      })
    );
  }

  // Уроки для журнала
  const lessons: Lesson[] = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const assignment = assignments[i % assignments.length];
    const lessonDate = new Date(today);
    lessonDate.setDate(today.getDate() - (11 - i));
    lessonDate.setHours(9 + (i % 4) * 2, 0, 0, 0);

    const lesson = await lessonRepo.save(
      lessonRepo.create({
        lessonDate,
        topic: `Занятие ${i + 1}: ${assignment.subject.name}`,
        subject: assignment.subject,
        teacher: assignment.teacher,
        group: assignment.group,
      })
    );
    lessons.push(lesson);
  }

  // Оценки и посещаемость (только для своих групп)
  for (const lesson of lessons) {
    const groupStudents = students.filter((s) => s.group.id === lesson.group.id);
    for (const student of groupStudents) {
      if (Math.random() > 0.3) {
        await gradeRepo.save(
          gradeRepo.create({
            value: Math.floor(Math.random() * 4) + 7,
            student,
            lesson,
          })
        );
      }
      const statuses = [
        AttendanceStatus.PRESENT,
        AttendanceStatus.ABSENT,
        AttendanceStatus.LATE,
      ];
      await attendanceRepo.save(
        attendanceRepo.create({
          status: statuses[Math.floor(Math.random() * statuses.length)],
          student,
          lesson,
        })
      );
    }
  }

  // Программа по предметам
  for (const subject of subjects.slice(0, 4)) {
    await programRepo.save([
      programRepo.create({
        subject,
        title: `Теория: ${subject.name}`,
        description: "Лекционный материал и методические указания",
        type: ProgramItemType.THEORY,
        materialUrl: "https://example.com/materials/theory.pdf",
        teamWork: false,
      }),
      programRepo.create({
        subject,
        title: `ЛР №1 — ${subject.name}`,
        description: "Первая лабораторная работа по дисциплине",
        type: ProgramItemType.LAB,
        materialUrl: "https://example.com/materials/lab1.pdf",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        teamWork: subject.name === "КПиЯП" || subject.name === "ВебПрогр",
      }),
    ]);
  }

  // Лабораторные работы
  const labConfigs = [
    {
      title: "ЛР №1 — Вёрстка макета",
      subject: subjects[1],
      teacher: teachers[1],
      lesson: lessons[2],
      team: true,
      groupStudents: students.filter((s) => s.group.id === group1.id).slice(0, 4),
    },
    {
      title: "ЛР №2 — REST API",
      subject: subjects[6],
      teacher: teachers[0],
      lesson: lessons[0],
      team: true,
      groupStudents: students.filter((s) => s.group.id === group1.id).slice(4, 6),
    },
    {
      title: "ЛР №1 — Модульное тестирование",
      subject: subjects[4],
      teacher: teachers[2],
      lesson: lessons[4],
      team: false,
      groupStudents: [],
    },
    {
      title: "ЛР №1 — Настройка сети",
      subject: subjects[5],
      teacher: teachers[2],
      lesson: lessons[5],
      team: true,
      groupStudents: students.filter((s) => s.group.id === group2.id).slice(0, 3),
    },
  ];

  const issuedAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const deadline = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);

  for (const cfg of labConfigs) {
    const lab = await labRepo.save(
      labRepo.create({
        title: cfg.title,
        description:
          "Теоретическая часть: изучите материалы по теме, выполните практическое задание согласно ТЗ. " +
          "Обратите внимание на критерии оценивания и сроки сдачи.",
        deadline,
        issuedAt,
        materialUrl: "https://example.com/materials/lab-task.pdf",
        subject: cfg.subject,
        teacher: cfg.teacher,
        lesson: cfg.lesson,
      })
    );

    if (cfg.team && cfg.groupStudents.length >= 2) {
      await teamRepo.save(
        teamRepo.create({
          name: `Команда — ${cfg.title}`,
          lab,
          students: cfg.groupStudents,
        })
      );
    }

    // Одна сдача для демонстрации
    await labSubmissionRepo.save(
      labSubmissionRepo.create({
        student: cfg.groupStudents[0] || students[0],
        lab,
        fileUrl: "/uploads/demo-submission.pdf",
        checked: false,
      })
    );
  }

  console.log("SEED COMPLETED");
  console.log("ADMIN: admin / admin123");
  console.log("TEACHERS: teacher1 / teacher1, teacher2 / teacher2, teacher3 / teacher3");
  console.log("STUDENTS: student1 / student1 … student50 / student50");
  console.log(`SUBJECTS: ${SUBJECT_NAMES.join(", ")}`);

  process.exit();
}

seed();
