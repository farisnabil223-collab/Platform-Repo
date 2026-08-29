import { ValueObject } from './value-object';

export class CourseCode extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^CRS_[A-Z0-9_]{3,20}$/.test(value)) {
      throw new Error(`Invalid CourseCode: ${value}. Must start with CRS_`);
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class LessonCode extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^LSN_[A-Z0-9_]{3,30}$/.test(value)) {
      throw new Error(`Invalid LessonCode: ${value}. Must start with LSN_`);
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class ModuleCode extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^MDL_[A-Z0-9_]{3,30}$/.test(value)) {
      throw new Error(`Invalid ModuleCode: ${value}. Must start with MDL_`);
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class ContentId extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^[0-9a-fA-F-]{36}$/.test(value)) {
      throw new Error(`Invalid ContentId: ${value}. Must be a valid UUID`);
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class CourseSlug extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^[a-z0-9-]+$/.test(value)) {
      throw new Error(`Invalid CourseSlug: ${value}. Must be alphanumeric and separated by hyphens`);
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class VersionNumber extends ValueObject<{ value: string }> {
  constructor(value: string) {
    if (!/^\d+\.\d+\.\d+$/.test(value)) {
      throw new Error(`Invalid VersionNumber: ${value}. Must be in semver format (x.y.z)`);
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class ContentType extends ValueObject<{ value: string }> {
  constructor(value: string) {
    const valid = ['VIDEO', 'PDF', 'ARTICLE', 'QUIZ', 'ASSIGNMENT', 'SCORM', 'AUDIO'];
    if (!valid.includes(value)) {
      throw new Error(`Invalid ContentType: ${value}. Valid options are: ${valid.join(', ')}`);
    }
    super({ value });
  }
  get value(): string { return this.props.value; }
}

export class Duration extends ValueObject<{ value: number }> {
  constructor(value: number) {
    if (value < 0) {
      throw new Error('Duration cannot be negative');
    }
    super({ value });
  }
  get value(): number { return this.props.value; }
}

export class CompletionPercentage extends ValueObject<{ value: number }> {
  constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('Completion percentage must be between 0 and 100');
    }
    super({ value });
  }
  get value(): number { return this.props.value; }
}
