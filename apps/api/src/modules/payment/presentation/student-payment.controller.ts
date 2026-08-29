import { Controller, Get, Post, Body, Param, UseGuards, Request, Res, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentOrchestrator } from '../application/payment.orchestrator';
import { PaymentProvider, PaymentMethod } from '@eduverse/payment-core';
import { IBillingRepository } from '../domain/billing.repository.interface';
import { IInvoiceStorageProvider } from '../domain/invoice-storage.provider.interface';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { Response } from 'express';

class CreateIntentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  provider!: PaymentProvider;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}

@ApiTags('Student Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student/payments')
export class StudentPaymentController {
  constructor(
    private readonly orchestrator: PaymentOrchestrator,
    @Inject(IBillingRepository)
    private readonly billingRepo: IBillingRepository,
    @Inject(IInvoiceStorageProvider)
    private readonly storageProvider: IInvoiceStorageProvider
  ) {}

  @Post('intents')
  @ApiOperation({ summary: 'Initiate payment intent session' })
  async createIntent(@Body() dto: CreateIntentDto, @Request() req: any) {
    const data = await this.orchestrator.createIntent(req.user.id, dto.orderId, dto.provider, dto.method);
    return {
      success: true,
      message: 'Payment intent created successfully',
      data,
    };
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice details' })
  async getInvoice(@Param('id') id: string) {
    const invoice = await this.billingRepo.findInvoiceById(id);
    return {
      success: true,
      data: invoice,
    };
  }

  @Get('invoices/:id/pdf')
  @ApiOperation({ summary: 'Download invoice PDF file' })
  async downloadInvoice(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.storageProvider.downloadInvoice(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
    res.send(pdfBuffer);
  }
}
