import { Module } from '@nestjs/common';
import { CredentialController } from './presentation/credential.controller';
import { RenderingService } from './application/rendering.service';
import {
  CertificateRepository,
  CertificateTemplateRepository,
  IssuerOrganizationRepository,
  CredentialWalletRepository,
  RevocationRecordRepository,
  CredentialShareRepository
} from '@eduverse/database';

@Module({
  controllers: [CredentialController],
  providers: [
    RenderingService,
    {
      provide: CertificateRepository,
      useFactory: () => new CertificateRepository(),
    },
    {
      provide: CertificateTemplateRepository,
      useFactory: () => new CertificateTemplateRepository(),
    },
    {
      provide: IssuerOrganizationRepository,
      useFactory: () => new IssuerOrganizationRepository(),
    },
    {
      provide: CredentialWalletRepository,
      useFactory: () => new CredentialWalletRepository(),
    },
    {
      provide: RevocationRecordRepository,
      useFactory: () => new RevocationRecordRepository(),
    },
    {
      provide: CredentialShareRepository,
      useFactory: () => new CredentialShareRepository(),
    },
  ],
  exports: [
    RenderingService,
  ],
})
export class CredentialsModule {}
