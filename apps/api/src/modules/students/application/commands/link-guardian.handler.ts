import { BadRequestException, Injectable } from '@nestjs/common';
import { GuardianRepository, StudentProfileRepository } from '@eduverse/database';
import { Guardian, generateUuidV7, GuardianLinked, DomainEventBus } from '@eduverse/kernel';
import { LinkGuardianDto } from '../../dto/link-guardian.dto';

@Injectable()
export class LinkGuardianHandler {
  constructor(
    private readonly guardianRepository: GuardianRepository,
    private readonly studentProfileRepository: StudentProfileRepository
  ) {}

  async execute(studentId: string, dto: LinkGuardianDto): Promise<void> {
    const student = await this.studentProfileRepository.findById(studentId);
    if (!student) {
      throw new BadRequestException('Student Profile not found');
    }

    let guardian = await this.guardianRepository.findByUserId(dto.guardianUserId);
    if (!guardian) {
      // Create new guardian profile
      guardian = new Guardian(generateUuidV7(), {
        userId: dto.guardianUserId,
        relation: dto.relation,
        studentIds: [],
      });
    }

    guardian.linkStudent(studentId);
    await this.guardianRepository.save(guardian);

    // Publish event
    await DomainEventBus.getInstance().publish(new GuardianLinked(guardian.id, studentId));
  }
}
