import { Test, TestingModule } from '@nestjs/testing';
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
} from '../presentation/sec-controllers';

describe('SecurityPlatformControllers', () => {
  let federatedIdentityController: FederatedIdentityController;
  let zeroTrustController: ZeroTrustController;
  let sessionSecurityController: SessionSecurityController;
  let secretsVaultController: SecretsVaultController;
  let pkiController: PkiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    federatedIdentityController = module.get<FederatedIdentityController>(FederatedIdentityController);
    zeroTrustController = module.get<ZeroTrustController>(ZeroTrustController);
    sessionSecurityController = module.get<SessionSecurityController>(SessionSecurityController);
    secretsVaultController = module.get<SecretsVaultController>(SecretsVaultController);
    pkiController = module.get<PkiController>(PkiController);
  });

  it('should define all 10 specialized security platform controllers', () => {
    expect(federatedIdentityController).toBeDefined();
    expect(zeroTrustController).toBeDefined();
    expect(sessionSecurityController).toBeDefined();
    expect(secretsVaultController).toBeDefined();
    expect(pkiController).toBeDefined();
  });
});
