import { Injectable, BadRequestException } from '@nestjs/common';
import { AssessmentAttemptRepository, prisma } from '@eduverse/database';
import {
  AnswerSavedEvent,
  AnswerChangedEvent,
  DomainEventBus,
  generateUuidV7
} from '@eduverse/kernel';
import { SaveAnswerDto } from '../../dto/assessment.dto';

@Injectable()
export class SaveAnswerHandler {
  constructor(private readonly attemptRepository: AssessmentAttemptRepository) {}

  async execute(attemptId: string, dto: SaveAnswerDto): Promise<void> {
    const attempt = await this.attemptRepository.findById(attemptId);
    if (!attempt) {
      throw new BadRequestException('Assessment attempt not found');
    }

    if (attempt.status !== 'STARTED' && attempt.status !== 'IN_PROGRESS' && attempt.status !== 'AUTO_SAVED') {
      throw new BadRequestException('Attempt is not in active progress state.');
    }

    // 1. Fetch or create QuestionAnswer
    let qa = await prisma.questionAnswer.findUnique({
      where: {
        attemptId_questionId: { attemptId, questionId: dto.questionId },
      },
    });

    const previousChoices = qa?.selectedChoice || [];

    if (!qa) {
      qa = await prisma.questionAnswer.create({
        data: {
          id: generateUuidV7(),
          attemptId,
          questionId: dto.questionId,
          textResponse: dto.textResponse,
          selectedChoice: dto.selectedChoices || [],
          isGraded: false,
        },
      });

      await DomainEventBus.getInstance().publish(
        new AnswerSavedEvent(attemptId, dto.questionId, qa.id)
      );
    } else {
      qa = await prisma.questionAnswer.update({
        where: { id: qa.id },
        data: {
          textResponse: dto.textResponse,
          selectedChoice: dto.selectedChoices || [],
        },
      });

      // 2. Add history change logs
      await prisma.answerHistory.create({
        data: {
          id: generateUuidV7(),
          answerId: qa.id,
          changeLog: {
            previous: previousChoices,
            current: dto.selectedChoices || [],
            timestamp: new Date(),
          } as any,
        },
      });

      await DomainEventBus.getInstance().publish(
        new AnswerChangedEvent(attemptId, dto.questionId, qa.id, qa.id)
      );
    }

    // 3. Keep cache on attempt status
    attempt.updateStatus('AUTO_SAVED');
    await this.attemptRepository.save(attempt);
  }
}
