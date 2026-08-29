import { DomainEvent } from './domain-event';

export class ResearchProposed extends DomainEvent {
  constructor(public readonly projectId: string) {
    super(projectId);
  }
}

export class ResearchApproved extends DomainEvent {
  constructor(public readonly projectId: string) {
    super(projectId);
  }
}

export class ResearchActivated extends DomainEvent {
  constructor(public readonly projectId: string) {
    super(projectId);
  }
}

export class EthicsApproved extends DomainEvent {
  constructor(public readonly projectId: string) {
    super(projectId);
  }
}

export class PublicationSubmitted extends DomainEvent {
  constructor(public readonly publicationId: string) {
    super(publicationId);
  }
}

export class PublicationAccepted extends DomainEvent {
  constructor(public readonly publicationId: string) {
    super(publicationId);
  }
}

export class GrantApplicationSubmitted extends DomainEvent {
  constructor(public readonly applicationId: string) {
    super(applicationId);
  }
}

export class GrantAwarded extends DomainEvent {
  constructor(public readonly applicationId: string) {
    super(applicationId);
  }
}

export class EquipmentReserved extends DomainEvent {
  constructor(public readonly reservationId: string) {
    super(reservationId);
  }
}

export class ReservationCancelled extends DomainEvent {
  constructor(public readonly reservationId: string) {
    super(reservationId);
  }
}

export class PatentRegistered extends DomainEvent {
  constructor(public readonly patentId: string) {
    super(patentId);
  }
}

export class KnowledgeAssetUploaded extends DomainEvent {
  constructor(public readonly assetId: string) {
    super(assetId);
  }
}

export class KnowledgeAssetPublished extends DomainEvent {
  constructor(public readonly assetId: string) {
    super(assetId);
  }
}
