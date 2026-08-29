import { DomainEvent } from './domain-event';
import { DomainRuleViolationException } from './domain-exceptions';
import { StudentProfile } from './academic-aggregates';
import { IEnrollmentRepository } from './repository.interface';

// 1. Domain Specifications
export class EnrollmentEligibilitySpecification {
  public static async isSatisfiedBy(
    student: StudentProfile,
    academicYearId: string,
    enrollmentRepo: IEnrollmentRepository
  ): Promise<boolean> {
    if (student.status !== 'ACTIVE') {
      throw new DomainRuleViolationException('Student profile is inactive, suspended, or expelled');
    }

    // Check if user has active enrollment in the same year
    const existing = await enrollmentRepo.findActiveEnrollment(student.id, academicYearId);
    if (existing) {
      throw new DomainRuleViolationException('Student is already actively enrolled in this Academic Year');
    }

    return true;
  }
}

// 2. Domain Policies
export class AcademicIntegrityPolicy {
  public static validateSectionCapacity(currentCount: number, capacity: number): boolean {
    if (currentCount >= capacity) {
      throw new DomainRuleViolationException(`Section capacity reached. Maximum classroom limit is ${capacity}`);
    }
    return true;
  }
}

// 3. Domain Events
export class StudentEnrolled extends DomainEvent {
  constructor(aggregateId: string, public readonly academicYearId: string, public readonly enrollmentNumber: string) {
    super(aggregateId);
  }
}

export class StudentTransferred extends DomainEvent {
  constructor(aggregateId: string, public readonly fromSectionId: string | null, public readonly toSectionId: string) {
    super(aggregateId);
  }
}

export class TeacherAssigned extends DomainEvent {
  constructor(aggregateId: string, public readonly subjectId: string) {
    super(aggregateId);
  }
}

export class TeacherUnassigned extends DomainEvent {
  constructor(aggregateId: string, public readonly subjectId: string) {
    super(aggregateId);
  }
}

export class GuardianLinked extends DomainEvent {
  constructor(aggregateId: string, public readonly studentId: string) {
    super(aggregateId);
  }
}

export class AcademicYearStarted extends DomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId);
  }
}

export class AcademicYearEnded extends DomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId);
  }
}

export class GradeCreatedEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly level: string) {
    super(aggregateId);
  }
}

export class SubjectCreatedEvent extends DomainEvent {
  constructor(aggregateId: string, public readonly code: string) {
    super(aggregateId);
  }
}
