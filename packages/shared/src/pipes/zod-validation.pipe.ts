import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Schema } from 'zod';
import { ValidationException } from '../errors/http.exceptions';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' && metadata.type !== 'query' && metadata.type !== 'param') {
      return value;
    }
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      }));
      throw new ValidationException('Validation failed', details);
    }
    return result.data;
  }
}

/**
 * Validation schema factory helper.
 */
export const ValidationFactory = {
  createPipe(schema: Schema): ZodValidationPipe {
    return new ZodValidationPipe(schema);
  },
};
