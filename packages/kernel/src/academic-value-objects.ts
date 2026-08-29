import { ValueObject } from './value-object';
import { DomainRuleViolationException } from './domain-exceptions';

export class AcademicYearCode extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^\d{4}-\d{4}$/.test(value)) {
      throw new DomainRuleViolationException('Academic Year Code must match YYYY-YYYY format');
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class SubjectCode extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^[A-Z]{2,6}_\d{3}$/.test(value)) {
      throw new DomainRuleViolationException('Subject Code must match uppercase letters and 3 digits (e.g. MATH_101)');
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class EnrollmentNumber extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^ENR_\d{4}_\d{6}$/.test(value)) {
      throw new DomainRuleViolationException('Enrollment Number must match ENR_YYYY_XXXXXX format');
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class StudentCode extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^STU_\d{4}_\d{4}$/.test(value)) {
      throw new DomainRuleViolationException('Student Code must match STU_YYYY_XXXX format');
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class TeacherCode extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^TCH_\d{4}_\d{4}$/.test(value)) {
      throw new DomainRuleViolationException('Teacher Code must match TCH_YYYY_XXXX format');
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class GradeLevel extends ValueObject<{ value: string }> {
  constructor(value: string) {
    const levelUpper = value.toUpperCase();
    const isValid = /^GRADE_\d{1,2}$/.test(levelUpper) || levelUpper === 'KINDERGARTEN';
    if (!isValid) {
      throw new DomainRuleViolationException('Grade Level must be GRADE_X or KINDERGARTEN');
    }
    super({ value: levelUpper });
  }
  get value(): string { return this.props.value; }
}
