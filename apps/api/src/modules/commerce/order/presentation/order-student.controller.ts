import { Controller, Get, Post, Body, Param, Query, Request, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from '../application/order.service';
import { OrderStatus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

class CheckoutDto {
  couponCode?: string;
}

@ApiTags('Student Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student/orders')
export class OrderStudentController {
  constructor(private readonly orderService: OrderService) {}

  private getMockUser(req: any) {
    return req.user?.id || 'd3b07384-d113-4ec2-a5d8-c04d021f1da8';
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Initiate checkout and create an order from current cart' })
  async checkout(
    @Request() req: any,
    @Body() dto: CheckoutDto,
    @Headers('x-idempotency-key') idempotencyKey?: string
  ) {
    const userId = this.getMockUser(req);
    const order = await this.orderService.createOrderFromCart(userId, idempotencyKey, dto.couponCode);
    return {
      success: true,
      message: 'Order created successfully',
      data: order,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List student purchase order logs history' })
  async getOrders(
    @Request() req: any,
    @Query('status') status?: OrderStatus,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const userId = this.getMockUser(req);
    const data = await this.orderService.getOrders({
      userId,
      status,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    return {
      success: true,
      message: 'Orders history retrieved successfully',
      data: data.items,
      meta: {
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student order details by ID' })
  async getOrder(@Param('id') id: string) {
    const order = await this.orderService.getOrderById(id);
    return {
      success: true,
      message: 'Order retrieved successfully',
      data: order,
    };
  }
}
