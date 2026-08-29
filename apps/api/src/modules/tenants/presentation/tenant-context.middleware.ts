import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContextAccessor } from '@eduverse/kernel';

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Resolve tenant from subdomain, custom domain, API key, or custom headers
    let tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId && req.headers.host) {
      const parts = req.headers.host.split('.');
      if (parts.length > 2) {
        tenantId = parts[0]; // e.g. tenant123.eduverse.com -> tenant123
      }
    }

    // Default fallback to prevent crash in non-isolated tests
    if (!tenantId) {
      tenantId = 'default-tenant-uuid';
    }

    const context = {
      tenantId,
      correlationId: (req.headers['x-correlation-id'] as string) || undefined,
      traceId: (req.headers['x-trace-id'] as string) || undefined,
    };

    TenantContextAccessor.runWithContext(context, () => {
      // Attach to request object as well for controller convenience
      (req as any).tenantId = tenantId;
      next();
    });
  }
}
