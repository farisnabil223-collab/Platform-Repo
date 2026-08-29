import { AggregateRoot } from './aggregate-root';

export interface GlobalCountryProps {
  tenantId: string;
  countryCode: string;
  name: string;
  taxRate: number;
}

export class GlobalCountry extends AggregateRoot<GlobalCountryProps> {
  constructor(id: string, props: GlobalCountryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get countryCode(): string { return this.props.countryCode; }
  get name(): string { return this.props.name; }
  get taxRate(): number { return this.props.taxRate; }
}

export interface GlobalRegionProps {
  tenantId: string;
  countryId: string;
  name: string;
  timezone: string;
}

export class GlobalRegion extends AggregateRoot<GlobalRegionProps> {
  constructor(id: string, props: GlobalRegionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get countryId(): string { return this.props.countryId; }
  get name(): string { return this.props.name; }
  get timezone(): string { return this.props.timezone; }
}

export interface GlobalCampusProps {
  tenantId: string;
  regionId: string;
  name: string;
  location: string;
}

export class GlobalCampus extends AggregateRoot<GlobalCampusProps> {
  constructor(id: string, props: GlobalCampusProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get regionId(): string { return this.props.regionId; }
  get name(): string { return this.props.name; }
  get location(): string { return this.props.location; }
}

export interface RegionalCalendarProps {
  tenantId: string;
  regionId: string;
  holidayDate: Date;
  description: string;
}

export class RegionalCalendar extends AggregateRoot<RegionalCalendarProps> {
  constructor(id: string, props: RegionalCalendarProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get regionId(): string { return this.props.regionId; }
  get holidayDate(): Date { return this.props.holidayDate; }
  get description(): string { return this.props.description; }
}

export interface LocalizationLanguageProps {
  tenantId: string;
  localeCode: string;
  isRtl: boolean;
}

export class LocalizationLanguage extends AggregateRoot<LocalizationLanguageProps> {
  constructor(id: string, props: LocalizationLanguageProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get localeCode(): string { return this.props.localeCode; }
  get isRtl(): boolean { return this.props.isRtl; }
}

export interface TranslationKeyProps {
  tenantId: string;
  keyName: string;
  namespace: string;
  englishDefault: string;
}

export class TranslationKey extends AggregateRoot<TranslationKeyProps> {
  constructor(id: string, props: TranslationKeyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get keyName(): string { return this.props.keyName; }
  get namespace(): string { return this.props.namespace; }
  get englishDefault(): string { return this.props.englishDefault; }
}

export interface TranslationValueProps {
  tenantId: string;
  languageId: string;
  keyId: string;
  translatedText: string;
  status: string;
}

export class TranslationValue extends AggregateRoot<TranslationValueProps> {
  constructor(id: string, props: TranslationValueProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get languageId(): string { return this.props.languageId; }
  get keyId(): string { return this.props.keyId; }
  get translatedText(): string { return this.props.translatedText; }
  get status(): string { return this.props.status; }
}

export interface MultiCurrencyProps {
  tenantId: string;
  currencyCode: string;
  exchangeRate: number;
}

export class MultiCurrency extends AggregateRoot<MultiCurrencyProps> {
  constructor(id: string, props: MultiCurrencyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get currencyCode(): string { return this.props.currencyCode; }
  get exchangeRate(): number { return this.props.exchangeRate; }
}

export interface CurrencyRateHistoryProps {
  tenantId: string;
  currencyId: string;
  rate: number;
}

export class CurrencyRateHistory extends AggregateRoot<CurrencyRateHistoryProps> {
  constructor(id: string, props: CurrencyRateHistoryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get currencyId(): string { return this.props.currencyId; }
  get rate(): number { return this.props.rate; }
}

export interface PrivacyPolicyProps {
  tenantId: string;
  countryCode: string;
  content: string;
  version: number;
}

export class PrivacyPolicy extends AggregateRoot<PrivacyPolicyProps> {
  constructor(id: string, props: PrivacyPolicyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get countryCode(): string { return this.props.countryCode; }
  get content(): string { return this.props.content; }
  get policyVersion(): number { return this.props.version; }
}

export interface ConsentPolicyProps {
  tenantId: string;
  countryCode: string;
  policyText: string;
}

export class ConsentPolicy extends AggregateRoot<ConsentPolicyProps> {
  constructor(id: string, props: ConsentPolicyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get countryCode(): string { return this.props.countryCode; }
  get policyText(): string { return this.props.policyText; }
}

export interface RetentionPolicyProps {
  tenantId: string;
  dataType: string;
  retentionYrs: number;
}

export class RetentionPolicy extends AggregateRoot<RetentionPolicyProps> {
  constructor(id: string, props: RetentionPolicyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get dataType(): string { return this.props.dataType; }
  get retentionYrs(): number { return this.props.retentionYrs; }
}

export interface AuditPolicyProps {
  tenantId: string;
  countryCode: string;
  rulesJson: any;
}

export class AuditPolicy extends AggregateRoot<AuditPolicyProps> {
  constructor(id: string, props: AuditPolicyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get countryCode(): string { return this.props.countryCode; }
  get rulesJson(): any { return this.props.rulesJson; }
}

export interface CountryRegulationProps {
  tenantId: string;
  countryCode: string;
  regulationId: string;
  description: string;
}

export class CountryRegulation extends AggregateRoot<CountryRegulationProps> {
  constructor(id: string, props: CountryRegulationProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get countryCode(): string { return this.props.countryCode; }
  get regulationId(): string { return this.props.regulationId; }
  get description(): string { return this.props.description; }
}

export interface DataResidencyPolicyProps {
  tenantId: string;
  countryCode: string;
  targetRegion: string;
}

export class DataResidencyPolicy extends AggregateRoot<DataResidencyPolicyProps> {
  constructor(id: string, props: DataResidencyPolicyProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get countryCode(): string { return this.props.countryCode; }
  get targetRegion(): string { return this.props.targetRegion; }
}

export interface IdentityProviderProps {
  tenantId: string;
  providerName: string;
  endpointUrl: string;
}

export class IdentityProvider extends AggregateRoot<IdentityProviderProps> {
  constructor(id: string, props: IdentityProviderProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }

  get tenantId(): string { return this.props.tenantId; }
  get providerName(): string { return this.props.providerName; }
  get endpointUrl(): string { return this.props.endpointUrl; }
}
