export interface GatewayChargeRequest {
  paymentId: string;
  amount: number;
  currency: string;
  paymentMethodToken?: string;
  metadata?: Record<string, any>;
}

export interface GatewayChargeResponse {
  success: boolean;
  transactionReference?: string;
  errorMessage?: string;
  status: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED';
}

export interface IPaymentGateway {
  name: string;
  charge(request: GatewayChargeRequest): Promise<GatewayChargeResponse>;
  refund(transactionRef: string, amount: number): Promise<boolean>;
}
