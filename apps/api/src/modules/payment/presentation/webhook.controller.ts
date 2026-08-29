import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentOrchestrator } from '../application/payment.orchestrator';
import { PaymentProvider } from '@eduverse/payment-core';

@ApiTags('Payment Webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly orchestrator: PaymentOrchestrator) {}

  @Post('paymob')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paymob webhook endpoint' })
  async handlePaymobWebhook(@Headers() headers: any, @Body() body: any) {
    const result = await this.orchestrator.handleWebhook(PaymentProvider.PAYMOB, headers, body);
    return {
      success: true,
      data: result,
    };
  }
}
