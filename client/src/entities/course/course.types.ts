export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  modules: Module[];
}


export interface CreateCourseDto {
  title: string;
  description: string;
}

export interface CreateModuleDto {
  courseId: string;
  title: string;
}

export interface CreateLessonDto {
  moduleId: string;
  title: string;
  content: string;
}
