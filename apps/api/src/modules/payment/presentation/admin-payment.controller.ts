import { Controller, Get, Post, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { PaymentStatus } from '@eduverse/payment-core';
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

class RefundRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

@ApiTags('Admin Payments & Billing')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('admin/payments')
export class AdminPaymentController {
  @Get()
  @ApiOperation({ summary: 'List and filter all payments' })
  async getPayments(
    @Query('status') status?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const where: any = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: parseInt(limit, 10),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      success: true,
      data: {
        items,
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10)),
      },
    };
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get payment event audit timeline logs' })
  async getPaymentTimeline(@Param('id') id: string) {
    const logs = await prisma.paymentLog.findMany({
      where: { paymentId: id },
      orderBy: { createdAt: 'asc' },
    });
    return {
      success: true,
      data: logs,
    };
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Process full or partial refund for a payment' })
  async processRefund(@Param('id') id: string, @Body() dto: RefundRequestDto) {
    const payment = await prisma.payment.findUniqueOrThrow({
      where: { id },
      include: { refunds: true },
    });

    if (payment.status !== 'CAPTURED' && payment.status !== 'PARTIALLY_REFUNDED') {
      throw new Error('Only captured or partially refunded payments can be refunded');
    }

    const refundedTotal = payment.refunds.reduce((sum, r) => sum + r.amount, 0) + dto.amount;
    if (refundedTotal > payment.amount) {
      throw new Error('Refund amount exceeds initial payment total');
    }

    const refundId = generateUuidV7();
    const newStatus = refundedTotal === payment.amount ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

    await prisma.$transaction([
      prisma.refund.create({
        data: {
          id: refundId,
          paymentId: id,
          amount: dto.amount,
          reason: dto.reason,
          status: 'COMPLETED',
        },
      }),
      prisma.payment.update({
        where: { id },
        data: { status: newStatus as any },
      }),
      prisma.paymentLog.create({
        data: {
          id: generateUuidV7(),
          paymentId: id,
          action: 'REFUND_COMPLETED',
          details: { refundId, amount: dto.amount, reason: dto.reason, status: newStatus },
        },
      }),
      prisma.outboxEvent.create({
        data: {
          id: generateUuidV7(),
          aggregate: 'Refund',
          eventType: 'PaymentRefunded',
          payload: { paymentId: id, refundId, amount: dto.amount },
        },
      }),
    ]);

    return {
      success: true,
      message: 'Refund processed successfully',
      data: { refundId, newStatus },
    };
  }
}
