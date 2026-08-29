import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import {
  GlobalCountryRepository,
  GlobalRegionRepository,
  GlobalCampusRepository,
  RegionalCalendarRepository,
  LocalizationLanguageRepository,
  TranslationKeyRepository,
  TranslationValueRepository,
  MultiCurrencyRepository,
  CurrencyRateHistoryRepository,
  PrivacyPolicyRepository,
  ConsentPolicyRepository,
  RetentionPolicyRepository,
  AuditPolicyRepository,
  CountryRegulationRepository,
  DataResidencyPolicyRepository,
  IdentityProviderRepository
} from '@eduverse/database';
import {
  generateUuidV7,
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
  IdentityProvider,
  TranslationEngine,
  CurrencyConverter,
  DomainEventBus,
  CountryCreated,
  RegionCreated,
  CampusCreated,
  LanguageAdded,
  TranslationUpdated,
  CurrencyUpdated,
  ExchangeRateChanged,
  CompliancePolicyCreated,
  IdentityProviderConfigured,
  RegionalSettingsUpdated
} from '@eduverse/kernel';

@ApiTags('Globalization & Localization')
@Controller('global')
export class GlobalController {
  private readonly countryRepo = new GlobalCountryRepository();
  private readonly regionRepo = new GlobalRegionRepository();
  private readonly campusRepo = new GlobalCampusRepository();
  private readonly calendarRepo = new RegionalCalendarRepository();
  private readonly languageRepo = new LocalizationLanguageRepository();
  private readonly keyRepo = new TranslationKeyRepository();
  private readonly valRepo = new TranslationValueRepository();
  private readonly currencyRepo = new MultiCurrencyRepository();
  private readonly historyRepo = new CurrencyRateHistoryRepository();
  private readonly privacyRepo = new PrivacyPolicyRepository();
  private readonly consentRepo = new ConsentPolicyRepository();
  private readonly retentionRepo = new RetentionPolicyRepository();
  private readonly auditRepo = new AuditPolicyRepository();
  private readonly regRepo = new CountryRegulationRepository();
  private readonly residencyRepo = new DataResidencyPolicyRepository();
  private readonly idpRepo = new IdentityProviderRepository();

  private readonly translationEngine = new TranslationEngine();
  private readonly converter = new CurrencyConverter();

  // 1. Countries
  @Post('countries')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register global country parameters' })
  async createCountry(@Request() req: any, @Body() body: {
    countryCode: string;
    name: string;
    taxRate: number;
  }) {
    const country = new GlobalCountry(generateUuidV7(), {
      tenantId: req.user.tenantId,
      countryCode: body.countryCode,
      name: body.name,
      taxRate: body.taxRate,
    });
    await this.countryRepo.save(country);
    await DomainEventBus.getInstance().publish(new CountryCreated(country.id));
    return { success: true, countryId: country.id };
  }

  // 2. Regions & Calendars
  @Post('regions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create region mapping and regional calendar configurations' })
  async createRegion(@Request() req: any, @Body() body: {
    countryId: string;
    name: string;
    timezone: string;
    holidays?: { date: string; desc: string }[];
  }) {
    const region = new GlobalRegion(generateUuidV7(), {
      tenantId: req.user.tenantId,
      countryId: body.countryId,
      name: body.name,
      timezone: body.timezone,
    });
    await this.regionRepo.save(region);

    if (body.holidays) {
      for (const h of body.holidays) {
        const cal = new RegionalCalendar(generateUuidV7(), {
          tenantId: req.user.tenantId,
          regionId: region.id,
          holidayDate: new Date(h.date),
          description: h.desc,
        });
        await this.calendarRepo.save(cal);
      }
    }

    await DomainEventBus.getInstance().publish(new RegionCreated(region.id));
    return { success: true, regionId: region.id };
  }

  // 3. Campuses
  @Post('campuses')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configure global campus hierarchy' })
  async createCampus(@Request() req: any, @Body() body: {
    regionId: string;
    name: string;
    location: string;
  }) {
    const campus = new GlobalCampus(generateUuidV7(), {
      tenantId: req.user.tenantId,
      regionId: body.regionId,
      name: body.name,
      location: body.location,
    });
    await this.campusRepo.save(campus);
    await DomainEventBus.getInstance().publish(new CampusCreated(campus.id));
    return { success: true, campusId: campus.id };
  }

  // 4. Languages & Translations
  @Post('localization/languages')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register localized languages packs' })
  async addLanguage(@Request() req: any, @Body() body: {
    localeCode: string;
    isRtl: boolean;
  }) {
    const lang = new LocalizationLanguage(generateUuidV7(), {
      tenantId: req.user.tenantId,
      localeCode: body.localeCode,
      isRtl: body.isRtl,
    });
    await this.languageRepo.save(lang);
    await DomainEventBus.getInstance().publish(new LanguageAdded(lang.id));
    return { success: true, languageId: lang.id };
  }

  @Post('localization/keys')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Define translation key namespace bundles' })
  async registerKey(@Request() req: any, @Body() body: {
    keyName: string;
    namespace: string;
    englishDefault: string;
  }) {
    const key = new TranslationKey(generateUuidV7(), {
      tenantId: req.user.tenantId,
      keyName: body.keyName,
      namespace: body.namespace,
      englishDefault: body.englishDefault,
    });
    await this.keyRepo.save(key);
    return { success: true, keyId: key.id };
  }

  @Post('localization/translations')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save translation values and status reviews' })
  async updateTranslation(@Request() req: any, @Body() body: {
    languageId: string;
    keyId: string;
    translatedText: string;
    status?: string;
  }) {
    const val = new TranslationValue(generateUuidV7(), {
      tenantId: req.user.tenantId,
      languageId: body.languageId,
      keyId: body.keyId,
      translatedText: body.translatedText,
      status: body.status ?? 'APPROVED',
    });
    await this.valRepo.save(val);
    await DomainEventBus.getInstance().publish(new TranslationUpdated(val.id));
    return { success: true, valueId: val.id };
  }

  // 5. Currencies
  @Post('currencies')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configure currencies and log historical exchange rate snapshots' })
  async updateCurrency(@Request() req: any, @Body() body: {
    currencyCode: string;
    exchangeRate: number;
  }) {
    const existing = await this.currencyRepo.findByCode(body.currencyCode);
    const id = existing ? existing.id : generateUuidV7();

    const currency = new MultiCurrency(id, {
      tenantId: req.user.tenantId,
      currencyCode: body.currencyCode,
      exchangeRate: body.exchangeRate,
    });
    await this.currencyRepo.save(currency);

    const history = new CurrencyRateHistory(generateUuidV7(), {
      tenantId: req.user.tenantId,
      currencyId: currency.id,
      rate: currency.exchangeRate,
    });
    await this.historyRepo.save(history);

    if (existing) {
      await DomainEventBus.getInstance().publish(new ExchangeRateChanged(currency.id, existing.exchangeRate, currency.exchangeRate));
    } else {
      await DomainEventBus.getInstance().publish(new CurrencyUpdated(currency.id));
    }

    return { success: true, currencyId: currency.id, exchangeRate: currency.exchangeRate };
  }

  // 6. Split Compliance Policies
  @Post('compliance/privacy')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish regional privacy policies' })
  async savePrivacy(@Request() req: any, @Body() body: {
    countryCode: string;
    content: string;
    version: number;
  }) {
    const policy = new PrivacyPolicy(generateUuidV7(), {
      tenantId: req.user.tenantId,
      countryCode: body.countryCode,
      content: body.content,
      version: body.version,
    });
    await this.privacyRepo.save(policy);
    await DomainEventBus.getInstance().publish(new CompliancePolicyCreated(policy.id, 'PRIVACY'));
    return { success: true, policyId: policy.id };
  }

  @Post('compliance/consent')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish regional consent policies templates' })
  async saveConsent(@Request() req: any, @Body() body: {
    countryCode: string;
    policyText: string;
  }) {
    const policy = new ConsentPolicy(generateUuidV7(), {
      tenantId: req.user.tenantId,
      countryCode: body.countryCode,
      policyText: body.policyText,
    });
    await this.consentRepo.save(policy);
    await DomainEventBus.getInstance().publish(new CompliancePolicyCreated(policy.id, 'CONSENT'));
    return { success: true, policyId: policy.id };
  }

  @Post('compliance/retention')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register data retention policies' })
  async saveRetention(@Request() req: any, @Body() body: {
    dataType: string;
    retentionYrs: number;
  }) {
    const policy = new RetentionPolicy(generateUuidV7(), {
      tenantId: req.user.tenantId,
      dataType: body.dataType,
      retentionYrs: body.retentionYrs,
    });
    await this.retentionRepo.save(policy);
    await DomainEventBus.getInstance().publish(new CompliancePolicyCreated(policy.id, 'RETENTION'));
    return { success: true, policyId: policy.id };
  }

  @Post('compliance/audit')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register compliance audit policies rules JSON logs templates' })
  async saveAudit(@Request() req: any, @Body() body: {
    countryCode: string;
    rulesJson: any;
  }) {
    const policy = new AuditPolicy(generateUuidV7(), {
      tenantId: req.user.tenantId,
      countryCode: body.countryCode,
      rulesJson: body.rulesJson,
    });
    await this.auditRepo.save(policy);
    await DomainEventBus.getInstance().publish(new CompliancePolicyCreated(policy.id, 'AUDIT'));
    return { success: true, policyId: policy.id };
  }

  @Post('compliance/regulation')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register country regulation laws metadata' })
  async saveRegulation(@Request() req: any, @Body() body: {
    countryCode: string;
    regulationId: string;
    description: string;
  }) {
    const reg = new CountryRegulation(generateUuidV7(), {
      tenantId: req.user.tenantId,
      countryCode: body.countryCode,
      regulationId: body.regulationId,
      description: body.description,
    });
    await this.regRepo.save(reg);
    await DomainEventBus.getInstance().publish(new CompliancePolicyCreated(reg.id, 'REGULATION'));
    return { success: true, regulationId: reg.id };
  }

  @Post('compliance/residency')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Map data residency target regions policies' })
  async saveResidency(@Request() req: any, @Body() body: {
    countryCode: string;
    targetRegion: string;
  }) {
    const policy = new DataResidencyPolicy(generateUuidV7(), {
      tenantId: req.user.tenantId,
      countryCode: body.countryCode,
      targetRegion: body.targetRegion,
    });
    await this.residencyRepo.save(policy);
    await DomainEventBus.getInstance().publish(new CompliancePolicyCreated(policy.id, 'RESIDENCY'));
    return { success: true, policyId: policy.id };
  }

  // 7. Identity Configuration
  @Post('identity/providers')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Configure regional single-sign-on identity provider endpoints' })
  async configureIdp(@Request() req: any, @Body() body: {
    providerName: string;
    endpointUrl: string;
  }) {
    const idp = new IdentityProvider(generateUuidV7(), {
      tenantId: req.user.tenantId,
      providerName: body.providerName,
      endpointUrl: body.endpointUrl,
    });
    await this.idpRepo.save(idp);
    await DomainEventBus.getInstance().publish(new IdentityProviderConfigured(idp.id));
    return { success: true, providerId: idp.id };
  }
}
