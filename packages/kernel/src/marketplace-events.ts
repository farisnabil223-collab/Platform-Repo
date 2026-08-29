import { DomainEvent } from './domain-event';

export class PartnerRegistered extends DomainEvent {
  constructor(public readonly partnerId: string) {
    super(partnerId);
  }
}

export class PartnerCertified extends DomainEvent {
  constructor(public readonly partnerId: string) {
    super(partnerId);
  }
}

export class ApiPublished extends DomainEvent {
  constructor(public readonly apiId: string) {
    super(apiId);
  }
}

export class ApplicationPublished extends DomainEvent {
  constructor(public readonly appId: string) {
    super(appId);
  }
}

export class ApplicationInstalled extends DomainEvent {
  constructor(public readonly installId: string) {
    super(installId);
  }
}

export class PluginInstalled extends DomainEvent {
  constructor(public readonly pluginId: string) {
    super(pluginId);
  }
}

export class PluginUpdated extends DomainEvent {
  constructor(public readonly pluginId: string) {
    super(pluginId);
  }
}

export class WebhookCreated extends DomainEvent {
  constructor(public readonly webhookId: string) {
    super(webhookId);
  }
}

export class WebhookDelivered extends DomainEvent {
  constructor(public readonly logId: string) {
    super(logId);
  }
}

export class ApiKeyGenerated extends DomainEvent {
  constructor(public readonly keyId: string) {
    super(keyId);
  }
}

export class OAuthClientRegistered extends DomainEvent {
  constructor(public readonly clientId: string) {
    super(clientId);
  }
}

export class DeveloperRegistered extends DomainEvent {
  constructor(public readonly developerId: string) {
    super(developerId);
  }
}

export class MarketplaceSubscriptionCreated extends DomainEvent {
  constructor(public readonly subscriptionId: string) {
    super(subscriptionId);
  }
}
