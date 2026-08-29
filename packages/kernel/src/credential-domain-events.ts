import { DomainEvent } from './domain-event';

export class CertificateGeneratedEvent extends DomainEvent {
  constructor(
    public readonly certificateId: string,
    public readonly pdfPath: string
  ) {
    super(certificateId);
  }
}

export class CertificateSignedEvent extends DomainEvent {
  constructor(
    public readonly certificateId: string,
    public readonly signatureValue: string
  ) {
    super(certificateId);
  }
}

export class CertificateIssuedEvent extends DomainEvent {
  constructor(
    public readonly certificateId: string,
    public readonly studentId: string,
    public readonly code: string
  ) {
    super(certificateId);
  }
}

export class CertificateDownloadedEvent extends DomainEvent {
  constructor(public readonly certificateId: string) {
    super(certificateId);
  }
}

export class CertificateRevokedEvent extends DomainEvent {
  constructor(
    public readonly certificateId: string,
    public readonly reason: string
  ) {
    super(certificateId);
  }
}

export class WalletUpdatedEvent extends DomainEvent {
  constructor(
    public readonly walletId: string,
    public readonly studentId: string
  ) {
    super(walletId);
  }
}

export class CertificateVerifiedEvent extends DomainEvent {
  constructor(
    public readonly certificateId: string,
    public readonly success: boolean
  ) {
    super(certificateId);
  }
}

export class CertificateSharedEvent extends DomainEvent {
  constructor(
    public readonly certificateId: string,
    public readonly shareToken: string
  ) {
    super(certificateId);
  }
}

export class CertificateImportedEvent extends DomainEvent {
  constructor(
    public readonly certificateId: string,
    public readonly code: string
  ) {
    super(certificateId);
  }
}

export class TemplatePublishedEvent extends DomainEvent {
  constructor(
    public readonly templateId: string,
    public readonly code: string
  ) {
    super(templateId);
  }
}

export class TemplateArchivedEvent extends DomainEvent {
  constructor(
    public readonly templateId: string,
    public readonly code: string
  ) {
    super(templateId);
  }
}

export class IssuerCreatedEvent extends DomainEvent {
  constructor(
    public readonly issuerId: string,
    public readonly code: string
  ) {
    super(issuerId);
  }
}

export class IssuerUpdatedEvent extends DomainEvent {
  constructor(
    public readonly issuerId: string,
    public readonly code: string
  ) {
    super(issuerId);
  }
}

export class TranscriptIssuedEvent extends DomainEvent {
  constructor(
    public readonly transcriptId: string,
    public readonly studentId: string
  ) {
    super(transcriptId);
  }
}
