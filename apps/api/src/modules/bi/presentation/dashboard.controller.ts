import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { DashboardService } from '../application/dashboard.service';

@ApiTags('Centralized Dashboards')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('executive')
  @ApiOperation({ summary: 'Get Executive analytics layout and metrics' })
  async getExecutive(@Query('dashboardId') dbId: string) {
    const data = await this.dashboardService.getDashboardLayout(dbId, 'EXECUTIVE');
    return { success: true, data };
  }

  @Get('academic')
  @ApiOperation({ summary: 'Get Academic success dashboard' })
  async getAcademic(@Query('dashboardId') dbId: string) {
    const data = await this.dashboardService.getDashboardLayout(dbId, 'INSTRUCTOR');
    return { success: true, data };
  }

  @Get('financial')
  @ApiOperation({ summary: 'Get Financial dashboard' })
  async getFinancial(@Query('dashboardId') dbId: string) {
    const data = await this.dashboardService.getDashboardLayout(dbId, 'FINANCE');
    return { success: true, data };
  }

  @Get('widgets')
  @ApiOperation({ summary: 'List custom dashboard widget definitions' })
  async getWidgets() {
    const list = await prisma.dashboardWidgetDefinition.findMany();
    return { success: true, data: list };
  }
}
