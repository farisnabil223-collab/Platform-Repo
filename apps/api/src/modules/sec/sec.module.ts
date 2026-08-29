import { Module } from '@nestjs/common';
import {
  FederatedIdentityController,
  ZeroTrustController,
  SessionSecurityController,
  DeviceTrustController,
  IamGovernanceController,
  BreakGlassController,
  SecretsVaultController,
  PkiController,
  ThreatIntelligenceController,
  SecurityComplianceController
} from './presentation/sec-controllers';

@Module({
  controllers: [
    FederatedIdentityController,
    ZeroTrustController,
    SessionSecurityController,
    DeviceTrustController,
    IamGovernanceController,
    BreakGlassController,
    SecretsVaultController,
    PkiController,
    ThreatIntelligenceController,
    SecurityComplianceController,
  ],
  providers: [],
  exports: [],
})
export class SecModule {}
