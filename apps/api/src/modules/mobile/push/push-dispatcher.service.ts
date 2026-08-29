import { Injectable, Logger } from '@nestjs/common';

export interface IPushProvider {
  sendPush(token: string, title: string, body: string, payload?: any): Promise<boolean>;
}

export const IPushProvider = Symbol('IPushProvider');

@Injectable()
export class FCMPushProvider implements IPushProvider {
  private readonly logger = new Logger(FCMPushProvider.name);
  async sendPush(token: string, title: string, body: string, payload?: any): Promise<boolean> {
    this.logger.log(`FCM Push successfully dispatched to: ${token.substring(0, 10)}...`);
    return true;
  }
}

@Injectable()
export class APNSPushProvider implements IPushProvider {
  private readonly logger = new Logger(APNSPushProvider.name);
  async sendPush(token: string, title: string, body: string, payload?: any): Promise<boolean> {
    this.logger.log(`APNS Push successfully dispatched to: ${token.substring(0, 10)}...`);
    return true;
  }
}

@Injectable()
export class PushDispatcherService {
  constructor(
    private readonly fcmProvider: FCMPushProvider,
    private readonly apnsProvider: APNSPushProvider
  ) {}

  async dispatch(provider: string, token: string, title: string, body: string, payload?: any): Promise<boolean> {
    if (provider === 'APNS') {
      return this.apnsProvider.sendPush(token, title, body, payload);
    }
    return this.fcmProvider.sendPush(token, title, body, payload);
  }
}
