import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TenantsController } from './presentation/tenants-v1.controller';
import { TenantContextMiddleware } from './presentation/tenant-context.middleware';
import { OrganizationsController } from './presentation/organizations.controller';
import { PlatformController } from './presentation/platform.controller';
import { OrganizationProvisioningEngine } from './application/organization-provisioning.engine';
import { OrganizationLifecycleService } from './application/organization-lifecycle.service';

@Module({
  controllers: [TenantsController, OrganizationsController, PlatformController],
  providers: [
    OrganizationProvisioningEngine,
    OrganizationLifecycleService,
  ],
  exports: [
    OrganizationProvisioningEngine,
    OrganizationLifecycleService,
  ],
})
export class TenantsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantContextMiddleware)
      .forRoutes('v1/tenants', 'api/v1/organizations', 'api/v1/platform');
  }
}
