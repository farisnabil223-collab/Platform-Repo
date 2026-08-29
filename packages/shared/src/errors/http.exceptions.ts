import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodeRegistry } from './error-codes';

export class BaseHttpException extends HttpException {
  constructor(
    public readonly errorCode: string,
    message: string,
    status: HttpStatus,
    public readonly details: any = null
  ) {
    super({ message, errorCode, details }, status);
  }
}

export class BusinessException extends BaseHttpException {
  constructor(message: string, details: any = null) {
    super(ErrorCodeRegistry.BUSINESS_RULE_VIOLATION, message, HttpStatus.UNPROCESSABLE_ENTITY, details);
  }
}

export class ValidationException extends BaseHttpException {
  constructor(message: string, details: any[] = []) {
    super(ErrorCodeRegistry.VALIDATION, message, HttpStatus.BAD_REQUEST, details);
  }
}

export class UnauthorizedException extends BaseHttpException {
  constructor(message = 'Unauthorized access') {
    super(ErrorCodeRegistry.UNAUTHORIZED, message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends BaseHttpException {
  constructor(message = 'Access forbidden') {
    super(ErrorCodeRegistry.FORBIDDEN, message, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends BaseHttpException {
  constructor(message = 'Resource not found') {
    super(ErrorCodeRegistry.NOT_FOUND, message, HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends BaseHttpException {
  constructor(message: string) {
    super(ErrorCodeRegistry.CONFLICT, message, HttpStatus.CONFLICT);
  }
}

export class InternalServerException extends BaseHttpException {
  constructor(message = 'An unexpected internal server error occurred', details: any = null) {
    super(ErrorCodeRegistry.INTERNAL_SERVER_ERROR, message, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}
