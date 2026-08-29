import { Injectable, ForbiddenException } from '@nestjs/common';
import { prisma } from '@eduverse/database';

@Injectable()
export class DashboardService {
  async getDashboardLayout(dashboardId: string, userRole: string) {
    // Validate role permissions
    const permission = await prisma.dashboardRolePermission.findFirst({
      where: { dashboardId, role: userRole },
    });

    if (permission && !permission.canView) {
      throw new ForbiddenException('Role is not authorized to view this dashboard layout.');
    }

    const instances = await prisma.dashboardWidgetInstance.findMany({
      where: { dashboardId },
      include: { definition: true },
    });

    const globalFilters = await prisma.dashboardFilter.findMany({
      where: { dashboardId },
    });

    return {
      dashboardId,
      instances,
      globalFilters,
    };
  }
}
