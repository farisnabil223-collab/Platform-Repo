import { Injectable, BadRequestException } from '@nestjs/common';
import { LearningContentRepository, LessonRepository, prisma } from '@eduverse/database';
import { LearningContent, ContentType, generateUuidV7 } from '@eduverse/kernel';
import { CreateContentDto } from '../../dto/course.dto';

@Injectable()
export class CreateLearningContentHandler {
  constructor(
    private readonly contentRepository: LearningContentRepository,
    private readonly lessonRepository: LessonRepository
  ) {}

  async execute(lessonId: string, dto: CreateContentDto): Promise<LearningContent> {
    const lesson = await this.lessonRepository.findById(lessonId);
    if (!lesson) {
      throw new BadRequestException('Lesson not found');
    }

    const content = new LearningContent(generateUuidV7(), {
      lessonId,
      contentType: new ContentType(dto.contentType),
      title: dto.title,
      sortOrder: dto.sortOrder,
      quizId: dto.quizId,
      assignmentId: dto.assignmentId,
    });

    await this.contentRepository.save(content);

    // Create learning content version record
    const versionId = generateUuidV7();
    await prisma.learningContentVersion.create({
      data: {
        id: versionId,
        contentId: content.id,
        versionNum: 1,
        payload: {
          mediaAssetId: dto.mediaAssetId,
          quizId: dto.quizId,
          assignmentId: dto.assignmentId,
        },
        isActive: true,
      },
    });

    content.setCurrentVersion(versionId);
    await this.contentRepository.save(content);

    return content;
  }
}
