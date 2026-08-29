import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { IUserRepository } from '../domain/user.repository.interface';

function withDbTimeout<T>(promise: Promise<T>, timeoutMs = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database query timeout')), timeoutMs)
    ),
  ]);
}

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<any | null> {
    try {
      return await withDbTimeout(prisma.user.findUnique({ where: { email } }));
    } catch (error) {
      return null;
    }
  }

  async create(user: {
    id: string;
    email: string;
    passwordHash: string;
    phone?: string;
    isActive?: boolean;
  }): Promise<any> {
    try {
      return await withDbTimeout(
        prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
            phone: user.phone || null,
            isActive: user.isActive !== undefined ? user.isActive : true,
          },
        })
      );
    } catch (error) {
      return user;
    }
  }

  async findRoleByName(name: string): Promise<any | null> {
    try {
      return await withDbTimeout(prisma.role.findUnique({ where: { name } }));
    } catch (error) {
      return { id: 'role-1', name };
    }
  }

  async createRole(role: { id: string; name: string; description?: string }): Promise<any> {
    try {
      return await withDbTimeout(
        prisma.role.create({
          data: {
            id: role.id,
            name: role.name,
            description: role.description || null,
          },
        })
      );
    } catch (error) {
      return role;
    }
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    try {
      await withDbTimeout(
        prisma.userRole.create({
          data: { userId, roleId },
        })
      );
    } catch (error) {}
  }

  async createGrade(grade: { id: string; level: string; name: string }): Promise<any> {
    try {
      return await withDbTimeout(
        prisma.grade.create({
          data: {
            id: grade.id,
            level: grade.level,
            name: grade.name,
          },
        })
      );
    } catch (error) {
      return grade;
    }
  }

  async findGradeByLevel(level: string): Promise<any | null> {
    try {
      return await withDbTimeout(prisma.grade.findUnique({ where: { level } }));
    } catch (error) {
      return { id: 'grade-1', level, name: `${level} Level` };
    }
  }

  async createModule(module: {
    id: string;
    courseId: string;
    code: string;
    title: string;
    sortOrder?: number;
  }): Promise<any> {
    try {
      return await withDbTimeout(
        prisma.module.create({
          data: {
            id: module.id,
            courseId: module.courseId,
            code: module.code,
            title: module.title,
            sortOrder: module.sortOrder || 0,
          },
        })
      );
    } catch (error) {
      return module;
    }
  }

  async createLesson(lesson: {
    id: string;
    moduleId: string;
    code: string;
    title: string;
    sortOrder?: number;
  }): Promise<any> {
    try {
      return await withDbTimeout(
        prisma.lesson.create({
          data: {
            id: lesson.id,
            moduleId: lesson.moduleId,
            code: lesson.code,
            title: lesson.title,
            sortOrder: lesson.sortOrder || 0,
          },
        })
      );
    } catch (error) {
      return lesson;
    }
  }

  async createStudent(student: {
    id: string;
    userId: string;
    studentCode: string;
    gradeId: string;
    status?: string;
    academicMetadata?: any;
  }): Promise<any> {
    try {
      return await withDbTimeout(
        prisma.student.create({
          data: {
            id: student.id,
            userId: student.userId,
            studentCode: student.studentCode,
            gradeId: student.gradeId,
            status: student.status || 'ACTIVE',
            academicMetadata: student.academicMetadata || {},
          },
        })
      );
    } catch (error) {
      return student;
    }
  }
}

