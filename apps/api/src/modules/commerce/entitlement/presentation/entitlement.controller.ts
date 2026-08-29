import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EntitlementService } from '../application/entitlement.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Student Entitlements')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student/entitlements')
export class EntitlementController {
  constructor(private readonly entitlementService: EntitlementService) {}

  private getMockUser(req: any) {
    return req.user?.id || 'd3b07384-d113-4ec2-a5d8-c04d021f1da8';
  }

  @Get()
  @ApiOperation({ summary: 'List student granted catalog entitlements' })
  async list(@Request() req: any, @Query('page') page = '1', @Query('limit') limit = '10') {
    const userId = this.getMockUser(req);
    const data = await this.entitlementService.getEntitlements(
      userId,
      parseInt(page, 10),
      parseInt(limit, 10)
    );
    return {
      success: true,
      message: 'Entitlements retrieved successfully',
      data: data.items,
      meta: {
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      },
    };
  }
}
