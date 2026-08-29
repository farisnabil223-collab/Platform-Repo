import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';

@Injectable()
export class LessonTranscriptsService {
  async getTranscript(lessonId: string, language = 'en') {
    return prisma.lessonTranscript.findUnique({
      where: {
        lessonId_language: {
          lessonId,
          language,
        },
      },
    });
  }
}
