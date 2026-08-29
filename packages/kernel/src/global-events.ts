import { DomainEvent } from './domain-event';

export class CountryCreated extends DomainEvent {
  constructor(public readonly countryId: string) {
    super(countryId);
  }
}

export class RegionCreated extends DomainEvent {
  constructor(public readonly regionId: string) {
    super(regionId);
  }
}

export class CampusCreated extends DomainEvent {
  constructor(public readonly campusId: string) {
    super(campusId);
  }
}

export class LanguageAdded extends DomainEvent {
  constructor(public readonly languageId: string) {
    super(languageId);
  }
}

export class TranslationUpdated extends DomainEvent {
  constructor(public readonly valueId: string) {
    super(valueId);
  }
}

export class CurrencyUpdated extends DomainEvent {
  constructor(public readonly currencyId: string) {
    super(currencyId);
  }
}

export class ExchangeRateChanged extends DomainEvent {
  constructor(public readonly currencyId: string, public readonly oldRate: number, public readonly newRate: number) {
    super(currencyId);
  }
}

export class CompliancePolicyCreated extends DomainEvent {
  constructor(public readonly policyId: string, public readonly policyType: string) {
    super(policyId);
  }
}

export class IdentityProviderConfigured extends DomainEvent {
  constructor(public readonly providerId: string) {
    super(providerId);
  }
}

export class RegionalSettingsUpdated extends DomainEvent {
  constructor(public readonly settingId: string) {
    super(settingId);
  }
}
