import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class StudentNotesService {
  async getNotes(userId: string, lessonId: string) {
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
    });

    return prisma.note.findMany({
      where: {
        studentId: student.id,
        lessonId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createNote(userId: string, lessonId: string, text: string) {
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
    });

    return prisma.note.create({
      data: {
        id: generateUuidV7(),
        studentId: student.id,
        lessonId,
        text,
      },
    });
  }

  async deleteNote(id: string) {
    await prisma.note.delete({
      where: { id },
    });
    return { success: true };
  }
}
