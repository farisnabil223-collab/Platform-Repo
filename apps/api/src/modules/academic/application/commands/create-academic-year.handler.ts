import { ConflictException, Injectable } from '@nestjs/common';
import { AcademicYearRepository } from '@eduverse/database';
import { AcademicYear, AcademicYearCode, generateUuidV7 } from '@eduverse/kernel';
import { CreateAcademicYearDto } from '../../dto/academic-year.dto';

@Injectable()
export class CreateAcademicYearHandler {
  constructor(private readonly academicYearRepository: AcademicYearRepository) {}

  async execute(dto: CreateAcademicYearDto): Promise<AcademicYear> {
    const existing = await this.academicYearRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('Academic Year with this code already exists');
    }

    const year = new AcademicYear(generateUuidV7(), {
      name: new AcademicYearCode(dto.name),
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      status: 'DRAFT',
      terms: dto.terms.map(t => ({
        id: generateUuidV7(),
        name: t.name,
        startDate: new Date(t.startDate),
        endDate: new Date(t.endDate),
        sortOrder: t.sortOrder,
        isActive: false,
      })),
    });

    await this.academicYearRepository.save(year);

    return year;
  }
}
