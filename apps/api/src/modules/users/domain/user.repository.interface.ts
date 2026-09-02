/* eslint-disable @typescript-eslint/no-redeclare */
export interface IUserRepository {
  findByEmail(email: string): Promise<any | null>;
  create(user: {
    id: string;
    email: string;
    passwordHash: string;
    phone?: string;
    isActive?: boolean;
  }): Promise<any>;
  findRoleByName(name: string): Promise<any | null>;
  createRole(role: { id: string; name: string; description?: string }): Promise<any>;
  assignRole(userId: string, roleId: string): Promise<void>;
  createGrade(grade: { id: string; level: string; name: string }): Promise<any>;
  findGradeByLevel(level: string): Promise<any | null>;
  createModule(module: {
    id: string;
    courseId: string;
    code: string;
    title: string;
    sortOrder?: number;
  }): Promise<any>;
  createLesson(lesson: {
    id: string;
    moduleId: string;
    code: string;
    title: string;
    sortOrder?: number;
  }): Promise<any>;
  createStudent(student: {
    id: string;
    userId: string;
    studentCode: string;
    gradeId: string;
    status?: string;
    academicMetadata?: any;
  }): Promise<any>;
}
export const IUserRepository = Symbol('IUserRepository');
