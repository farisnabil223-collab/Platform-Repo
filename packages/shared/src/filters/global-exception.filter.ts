import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { DomainException } from '@eduverse/kernel';
import { BaseHttpException } from '../errors/http.exceptions';
import { ErrorCodeRegistry } from '../errors/error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const traceId = response.getHeader('x-trace-id') || request.id || 'N/A';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ErrorCodeRegistry.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected internal error occurred';
    let details: any = null;

    if (exception instanceof BaseHttpException) {
      status = exception.getStatus();
      code = exception.errorCode;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      code = res.errorCode || `ERR_${status}`;
      message = res.message || exception.message;
      details = res.details || null;
    } else if (exception instanceof DomainException) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      code = exception.code;
      message = exception.message;
    } else if (exception instanceof Error) {
      // In production, keep message secure and write details to logs only
      message = process.env.NODE_ENV === 'production' ? 'Internal server error' : exception.message;
      if (process.env.NODE_ENV !== 'production') {
        details = { stack: exception.stack };
      }
    }

    // Mask sensitive fields in details if present (security compliance)
    if (details && typeof details === 'object') {
      const keysToMask = ['password', 'token', 'passwordHash', 'creditCard', 'cardNumber', 'cvv'];
      const maskObject = (obj: any): any => {
        const copy = { ...obj };
        for (const key in copy) {
          if (keysToMask.includes(key)) {
            copy[key] = '***MASKED***';
          } else if (typeof copy[key] === 'object' && copy[key] !== null) {
            copy[key] = maskObject(copy[key]);
          }
        }
        return copy;
      };
      details = maskObject(details);
    }

    const errorResponse = {
      success: false,
      error: {
        code,
        message,
        details,
        correlationId: traceId,
        timestamp: new Date().toISOString(),
      },
    };

    // Log the error using standard pino logger if injected
    const pinoLogger = request.log;
    if (pinoLogger) {
      pinoLogger.error({
        msg: `HTTP Error: ${message}`,
        code,
        status,
        traceId,
        path: request.url,
        method: request.method,
        exception: exception instanceof Error ? { message: exception.message, stack: exception.stack } : exception,
      });
    } else {
      console.error('Pino logger not injected. Fallback console error:', errorResponse);
    }

    response.status(status).json(errorResponse);
  }
}
