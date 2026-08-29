import { IPaymentGateway, GatewayChargeRequest, GatewayChargeResponse } from './payment-gateway.interface';

export class PaymentOrchestrator {
  private gateways: IPaymentGateway[] = [];
  private circuitOpen = false;
  private lastFailureTime = 0;

  constructor(gateways: IPaymentGateway[]) {
    this.gateways = gateways;
  }

  async execute(request: GatewayChargeRequest): Promise<GatewayChargeResponse> {
    if (this.circuitOpen && Date.now() - this.lastFailureTime < 30000) {
      throw new Error('Circuit Breaker active: Payment Orchestrator routing suspended');
    }

    this.circuitOpen = false;

    // Retry and fallback loop
    for (const gateway of this.gateways) {
      try {
        const response = await gateway.charge(request);
        if (response.success) {
          return response;
        }
      } catch (error) {
        // Log failure and fall through
      }
    }

    this.circuitOpen = true;
    this.lastFailureTime = Date.now();
    return {
      success: false,
      status: 'FAILED',
      errorMessage: 'All gateways exhausted. Transaction failed.',
    };
  }
}
export class MockGateway implements IPaymentGateway {
  constructor(public readonly name: string) {}
  async charge(req: GatewayChargeRequest): Promise<GatewayChargeResponse> {
    return { success: true, transactionReference: 'tx_' + req.paymentId.substring(0, 8), status: 'CAPTURED' };
  }
  async refund(_ref: string, _amt: number): Promise<boolean> {
    return true;
  }
}
