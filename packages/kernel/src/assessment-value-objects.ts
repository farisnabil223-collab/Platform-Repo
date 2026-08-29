import { ValueObject } from './value-object';

export class AssessmentCode extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^ASM_[A-Z0-9_]{3,30}$/.test(value)) {
      throw new Error(`Invalid AssessmentCode: ${value}. Must start with ASM_`);
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class QuestionCode extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^QST_[A-Z0-9_]{3,30}$/.test(value)) {
      throw new Error(`Invalid QuestionCode: ${value}. Must start with QST_`);
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class AttemptNumber extends ValueObject<{ value: number }> {
  constructor(value: number) {
    if (value <= 0) {
      throw new Error('Attempt number must be a positive integer.');
    }
    super({ value });
  }
  get value(): number { return this.props.value; }
}

export class PassingScore extends ValueObject<{ value: number }> {
  constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('Passing score must be between 0 and 100.');
    }
    super({ value });
  }
  get value(): number { return this.props.value; }
}

export class GradeScale extends ValueObject<{ value: Record<string, [number, number]> }> {
  constructor(value: Record<string, [number, number]>) {
    super({ value });
  }
  get value(): Record<string, [number, number]> { return this.props.value; }
}

export class Score extends ValueObject<{ value: number }> {
  constructor(value: number) {
    super({ value });
  }
  get value(): number { return this.props.value; }
}

export class AssessmentDuration extends ValueObject<{ value: number }> {
  constructor(value: number) {
    if (value < 0) {
      throw new Error('Duration cannot be negative.');
    }
    super({ value });
  }
  get value(): number { return this.props.value; }
}

export class QuestionDifficulty extends ValueObject<{ value: 'EASY' | 'MEDIUM' | 'HARD' }> {
  constructor(value: 'EASY' | 'MEDIUM' | 'HARD') {
    super({ value });
  }
  get value(): 'EASY' | 'MEDIUM' | 'HARD' { return this.props.value; }
}

export class QuestionType extends ValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class AssessmentStatus extends ValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
  }
  get value(): string { return this.props.value; }
}
