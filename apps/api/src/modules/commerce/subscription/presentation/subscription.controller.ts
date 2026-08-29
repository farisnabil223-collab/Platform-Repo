import { Controller, Get, Post, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from '../application/subscription.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student/subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  private getMockUser(req: any) {
    return req.user?.id || 'd3b07384-d113-4ec2-a5d8-c04d021f1da8';
  }

  @Get()
  @ApiOperation({ summary: 'List student active plan subscriptions' })
  async list(@Request() req: any) {
    const userId = this.getMockUser(req);
    const data = await this.subscriptionService.getSubscriptions(userId);
    return {
      success: true,
      message: 'Subscriptions retrieved successfully',
      data,
    };
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel active plan subscription auto-renew' })
  async cancel(@Param('id') id: string) {
    const updated = await this.subscriptionService.cancelSubscription(id);
    return {
      success: true,
      message: 'Subscription renewal cancelled successfully',
      data: updated,
    };
  }
}
