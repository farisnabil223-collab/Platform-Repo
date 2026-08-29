import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpCtx = context.switchToHttp();
    const response = httpCtx.getResponse();
    const request = httpCtx.getRequest();
    const traceId = response.getHeader('x-trace-id') || request.id || 'N/A';

    return next.handle().pipe(
      map((data) => {
        let responseData = data;
        let meta = undefined;

        // If the return object is paginated (i.e. has data list and meta object)
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          responseData = data.data;
          meta = data.meta;
        }

        return {
          success: true,
          data: responseData !== undefined ? responseData : null,
          meta,
          traceId,
        };
      })
    );
  }
}
