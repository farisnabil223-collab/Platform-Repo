import { BadRequestException, Injectable } from '@nestjs/common';
import { AcademicYearRepository } from '@eduverse/database';
import { AcademicYearStarted, AcademicYearEnded, DomainEventBus } from '@eduverse/kernel';
import { TransitionYearDto } from '../../dto/academic-year.dto';

@Injectable()
export class TransitionYearHandler {
  constructor(private readonly academicYearRepository: AcademicYearRepository) {}

  async execute(id: string, dto: TransitionYearDto): Promise<void> {
    const year = await this.academicYearRepository.findById(id);
    if (!year) {
      throw new BadRequestException('Academic Year not found');
    }

    const previousStatus = year.status;
    year.transitionTo(dto.status as any);

    await this.academicYearRepository.save(year);

    // If transitioned to ACTIVE, dispatch year started event
    if (dto.status === 'ACTIVE' && previousStatus !== 'ACTIVE') {
      await DomainEventBus.getInstance().publish(new AcademicYearStarted(year.id));
    }

    // If transitioned to CLOSED, dispatch year ended event
    if (dto.status === 'CLOSED' && previousStatus === 'ACTIVE') {
      await DomainEventBus.getInstance().publish(new AcademicYearEnded(year.id));
    }
  }
}
