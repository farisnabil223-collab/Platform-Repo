import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  GlobalCountry,
  GlobalRegion,
  GlobalCampus,
  RegionalCalendar,
  LocalizationLanguage,
  TranslationKey,
  TranslationValue,
  MultiCurrency,
  CurrencyRateHistory,
  PrivacyPolicy,
  ConsentPolicy,
  RetentionPolicy,
  AuditPolicy,
  CountryRegulation,
  DataResidencyPolicy,
  IdentityProvider
} from '@eduverse/kernel';

export class GlobalCountryRepository extends BaseTenantRepository {
  async save(country: GlobalCountry): Promise<void> {
    await prisma.globalCountry.upsert({
      where: { id: country.id },
      update: { taxRate: country.taxRate },
      create: {
        id: country.id,
        tenantId: this.getTenantIdOrThrow(),
        countryCode: country.countryCode,
        name: country.name,
        taxRate: country.taxRate,
      },
    });
  }

  async findByCode(countryCode: string): Promise<GlobalCountry | null> {
    const row = await prisma.globalCountry.findFirst({
      where: { countryCode, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new GlobalCountry(row.id, {
      tenantId: row.tenantId,
      countryCode: row.countryCode,
      name: row.name,
      taxRate: row.taxRate,
    });
  }
}

export class GlobalRegionRepository extends BaseTenantRepository {
  async save(region: GlobalRegion): Promise<void> {
    await prisma.globalRegion.upsert({
      where: { id: region.id },
      update: { name: region.name },
      create: {
        id: region.id,
        tenantId: this.getTenantIdOrThrow(),
        countryId: region.countryId,
        name: region.name,
        timezone: region.timezone,
      },
    });
  }
}

export class GlobalCampusRepository extends BaseTenantRepository {
  async save(campus: GlobalCampus): Promise<void> {
    await prisma.globalCampus.upsert({
      where: { id: campus.id },
      update: { name: campus.name },
      create: {
        id: campus.id,
        tenantId: this.getTenantIdOrThrow(),
        regionId: campus.regionId,
        name: campus.name,
        location: campus.location,
      },
    });
  }
}

export class RegionalCalendarRepository extends BaseTenantRepository {
  async save(cal: RegionalCalendar): Promise<void> {
    await prisma.regionalCalendar.upsert({
      where: { id: cal.id },
      update: { description: cal.description },
      create: {
        id: cal.id,
        tenantId: this.getTenantIdOrThrow(),
        regionId: cal.regionId,
        holidayDate: cal.holidayDate,
        description: cal.description,
      },
    });
  }
}

export class LocalizationLanguageRepository extends BaseTenantRepository {
  async save(lang: LocalizationLanguage): Promise<void> {
    await prisma.localizationLanguage.upsert({
      where: { id: lang.id },
      update: { isRtl: lang.isRtl },
      create: {
        id: lang.id,
        tenantId: this.getTenantIdOrThrow(),
        localeCode: lang.localeCode,
        isRtl: lang.isRtl,
      },
    });
  }
}

export class TranslationKeyRepository extends BaseTenantRepository {
  async save(key: TranslationKey): Promise<void> {
    await prisma.translationKey.upsert({
      where: { id: key.id },
      update: { englishDefault: key.englishDefault },
      create: {
        id: key.id,
        tenantId: this.getTenantIdOrThrow(),
        keyName: key.keyName,
        namespace: key.namespace,
        englishDefault: key.englishDefault,
      },
    });
  }

  async findByName(keyName: string): Promise<TranslationKey | null> {
    const row = await prisma.translationKey.findFirst({
      where: { keyName, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new TranslationKey(row.id, {
      tenantId: row.tenantId,
      keyName: row.keyName,
      namespace: row.namespace,
      englishDefault: row.englishDefault,
    });
  }
}

export class TranslationValueRepository extends BaseTenantRepository {
  async save(val: TranslationValue): Promise<void> {
    await prisma.translationValue.upsert({
      where: { id: val.id },
      update: { translatedText: val.translatedText, status: val.status },
      create: {
        id: val.id,
        tenantId: this.getTenantIdOrThrow(),
        languageId: val.languageId,
        keyId: val.keyId,
        translatedText: val.translatedText,
        status: val.status,
      },
    });
  }

  async findByLanguageAndKey(languageId: string, keyId: string): Promise<TranslationValue | null> {
    const row = await prisma.translationValue.findFirst({
      where: { languageId, keyId, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new TranslationValue(row.id, {
      tenantId: row.tenantId,
      languageId: row.languageId,
      keyId: row.keyId,
      translatedText: row.translatedText,
      status: row.status,
    });
  }
}

export class MultiCurrencyRepository extends BaseTenantRepository {
  async save(currency: MultiCurrency): Promise<void> {
    await prisma.multiCurrency.upsert({
      where: { id: currency.id },
      update: { exchangeRate: currency.exchangeRate },
      create: {
        id: currency.id,
        tenantId: this.getTenantIdOrThrow(),
        currencyCode: currency.currencyCode,
        exchangeRate: currency.exchangeRate,
      },
    });
  }

  async findByCode(currencyCode: string): Promise<MultiCurrency | null> {
    const row = await prisma.multiCurrency.findFirst({
      where: { currencyCode, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new MultiCurrency(row.id, {
      tenantId: row.tenantId,
      currencyCode: row.currencyCode,
      exchangeRate: row.exchangeRate,
    });
  }
}

export class CurrencyRateHistoryRepository extends BaseTenantRepository {
  async save(history: CurrencyRateHistory): Promise<void> {
    await prisma.currencyRateHistory.create({
      data: {
        id: history.id,
        tenantId: this.getTenantIdOrThrow(),
        currencyId: history.currencyId,
        rate: history.rate,
      },
    });
  }
}

export class PrivacyPolicyRepository extends BaseTenantRepository {
  async save(policy: PrivacyPolicy): Promise<void> {
    await prisma.privacyPolicy.upsert({
      where: { id: policy.id },
      update: { content: policy.content },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        countryCode: policy.countryCode,
        content: policy.content,
        version: policy.policyVersion,
      },
    });
  }
}

export class ConsentPolicyRepository extends BaseTenantRepository {
  async save(policy: ConsentPolicy): Promise<void> {
    await prisma.consentPolicy.upsert({
      where: { id: policy.id },
      update: { policyText: policy.policyText },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        countryCode: policy.countryCode,
        policyText: policy.policyText,
      },
    });
  }
}

export class RetentionPolicyRepository extends BaseTenantRepository {
  async save(policy: RetentionPolicy): Promise<void> {
    await prisma.retentionPolicy.upsert({
      where: { id: policy.id },
      update: { retentionYrs: policy.retentionYrs },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        dataType: policy.dataType,
        retentionYrs: policy.retentionYrs,
      },
    });
  }
}

export class AuditPolicyRepository extends BaseTenantRepository {
  async save(policy: AuditPolicy): Promise<void> {
    await prisma.auditPolicy.upsert({
      where: { id: policy.id },
      update: { rulesJson: policy.rulesJson },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        countryCode: policy.countryCode,
        rulesJson: policy.rulesJson,
      },
    });
  }
}

export class CountryRegulationRepository extends BaseTenantRepository {
  async save(reg: CountryRegulation): Promise<void> {
    await prisma.countryRegulation.upsert({
      where: { id: reg.id },
      update: { description: reg.description },
      create: {
        id: reg.id,
        tenantId: this.getTenantIdOrThrow(),
        countryCode: reg.countryCode,
        regulationId: reg.regulationId,
        description: reg.description,
      },
    });
  }
}

export class DataResidencyPolicyRepository extends BaseTenantRepository {
  async save(policy: DataResidencyPolicy): Promise<void> {
    await prisma.dataResidencyPolicy.upsert({
      where: { id: policy.id },
      update: { targetRegion: policy.targetRegion },
      create: {
        id: policy.id,
        tenantId: this.getTenantIdOrThrow(),
        countryCode: policy.countryCode,
        targetRegion: policy.targetRegion,
      },
    });
  }
}

export class IdentityProviderRepository extends BaseTenantRepository {
  async save(provider: IdentityProvider): Promise<void> {
    await prisma.identityProvider.upsert({
      where: { id: provider.id },
      update: { endpointUrl: provider.endpointUrl },
      create: {
        id: provider.id,
        tenantId: this.getTenantIdOrThrow(),
        providerName: provider.providerName,
        endpointUrl: provider.endpointUrl,
      },
    });
  }
}
