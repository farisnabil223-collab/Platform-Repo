import { Injectable, BadRequestException } from '@nestjs/common';
import { AssessmentRepository, AssessmentAttemptRepository, prisma } from '@eduverse/database';
import {
  AssessmentAttempt,
  AttemptNumber,
  AttemptStartedEvent,
  DomainEventBus,
  generateUuidV7
} from '@eduverse/kernel';
import { StartAttemptDto } from '../../dto/assessment.dto';

@Injectable()
export class StartAttemptHandler {
  constructor(
    private readonly assessmentRepository: AssessmentRepository,
    private readonly attemptRepository: AssessmentAttemptRepository
  ) {}

  async execute(assessmentId: string, dto: StartAttemptDto): Promise<AssessmentAttempt> {
    const assessment = await this.assessmentRepository.findById(assessmentId);
    if (!assessment) {
      throw new BadRequestException('Assessment not found');
    }

    const previousAttempts = await prisma.assessmentAttempt.count({
      where: { assessmentId, studentId: dto.studentId },
    });

    const maxAttempts = (assessment.settings as any)?.maxAttempts ?? 3;
    if (previousAttempts >= maxAttempts) {
      throw new BadRequestException('Maximum attempt limit reached');
    }

    // 1. Snapshot logic: Enforce snapshot lock on first attempt start
    const snapshotCount = await prisma.assessmentSnapshot.count({
      where: { assessmentId },
    });

    if (snapshotCount === 0) {
      const qMappings = await prisma.assessmentQuestion.findMany({
        where: { assessmentId },
        include: {
          question: {
            include: { choices: true },
          },
        },
      });

      const snapshotData = qMappings.map(m => ({
        questionId: m.questionId,
        text: m.question.text,
        type: m.question.type,
        pointsWeight: m.pointsWeight,
        sortOrder: m.sortOrder,
        choices: m.question.choices.map(c => ({
          id: c.id,
          text: c.text,
          weight: c.weight,
        })),
      }));

      await prisma.assessmentSnapshot.create({
        data: {
          id: generateUuidV7(),
          assessmentId,
          snapshotData: snapshotData as any,
        },
      });
    }

    // 2. Create AssessmentAttempt in STARTED state
    const attemptId = generateUuidV7();
    const attempt = new AssessmentAttempt(attemptId, {
      assessmentId,
      studentId: dto.studentId,
      status: 'STARTED',
      attemptNum: new AttemptNumber(previousAttempts + 1),
      startedAt: new Date(),
      version: 1,
    });

    await this.attemptRepository.save(attempt);

    // Publish event
    await DomainEventBus.getInstance().publish(
      new AttemptStartedEvent(attemptId, dto.studentId, assessmentId)
    );

    return attempt;
  }
}
