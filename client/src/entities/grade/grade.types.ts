export interface Grade {
  id: string;
  studentId: string;
  lessonId: string;
  value: number; 
  comment?: string;
  createdAt: string;
}


export interface StudentGradeRow {
  studentId: string;
  studentName: string;
  grades: {
    [lessonId: string]: Grade; 
  };
}


export interface SetGradeDto {
  studentId: string;
  lessonId: string;
  value: number;
  comment?: string;
}
