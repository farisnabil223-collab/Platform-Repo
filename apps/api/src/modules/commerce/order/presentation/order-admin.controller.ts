import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from '../application/order.service';
import { OrderStatus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

import { IsEnum, IsString, IsOptional } from 'class-validator';

class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

@ApiTags('Admin Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('admin/orders')
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'List and filter all orders' })
  async getOrders(
    @Query('userId') userId?: string,
    @Query('status') status?: OrderStatus,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const data = await this.orderService.getOrders({
      userId,
      status,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    return {
      success: true,
      message: 'Orders retrieved successfully',
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
  @ApiOperation({ summary: 'Retrieve specific order details' })
  async getOrder(@Param('id') id: string) {
    const order = await this.orderService.getOrderById(id);
    return {
      success: true,
      message: 'Order retrieved successfully',
      data: order,
    };
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Manually update order status' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    const order = await this.orderService.updateOrderStatus(id, dto.status, dto.notes);
    return {
      success: true,
      message: 'Order status updated successfully',
      data: order,
    };
  }
}
