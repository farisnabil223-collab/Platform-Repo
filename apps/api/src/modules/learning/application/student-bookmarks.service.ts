import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class StudentBookmarksService {
  async getBookmarks(userId: string, lessonId: string) {
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
    });

    return prisma.bookmark.findMany({
      where: {
        studentId: student.id,
        lessonId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBookmark(userId: string, lessonId: string, secondsOffset: number, noteText?: string) {
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
    });

    return prisma.bookmark.create({
      data: {
        id: generateUuidV7(),
        studentId: student.id,
        lessonId,
        secondsOffset,
        noteText,
      },
    });
  }

  async deleteBookmark(id: string) {
    await prisma.bookmark.delete({
      where: { id },
    });
    return { success: true };
  }
}
