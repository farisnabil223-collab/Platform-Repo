import { Injectable, BadRequestException } from '@nestjs/common';
import { AssessmentResultRepository, prisma } from '@eduverse/database';
import { GradeAppealCreatedEvent, DomainEventBus, generateUuidV7 } from '@eduverse/kernel';
import { AppealResultDto } from '../../dto/assessment.dto';

@Injectable()
export class CreateAppealHandler {
  constructor(private readonly resultRepository: AssessmentResultRepository) {}

  async execute(resultId: string, dto: AppealResultDto) {
    const result = await this.resultRepository.findById(resultId);
    if (!result) {
      throw new BadRequestException('Assessment result not found');
    }

    const appealId = generateUuidV7();
    const appeal = await prisma.gradeAppeal.create({
      data: {
        id: appealId,
        resultId,
        studentId: dto.studentId,
        reason: dto.reason,
        status: 'SUBMITTED',
      },
    });

    await DomainEventBus.getInstance().publish(
      new GradeAppealCreatedEvent(appealId, resultId, dto.studentId)
    );

    return appeal;
  }
}
