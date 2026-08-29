import { DomainEvent } from './domain-event';

export class AlumniRegistered extends DomainEvent {
  constructor(public readonly alumniId: string) {
    super(alumniId);
  }
}

export class AlumniVerified extends DomainEvent {
  constructor(public readonly alumniId: string) {
    super(alumniId);
  }
}

export class MentorAssigned extends DomainEvent {
  constructor(public readonly mentorId: string, public readonly studentId: string) {
    super(mentorId);
  }
}

export class MentorshipStarted extends DomainEvent {
  constructor(public readonly programId: string) {
    super(programId);
  }
}

export class MentorshipCompleted extends DomainEvent {
  constructor(public readonly programId: string) {
    super(programId);
  }
}

export class JobPosted extends DomainEvent {
  constructor(public readonly jobId: string) {
    super(jobId);
  }
}

export class ApplicationSubmitted extends DomainEvent {
  constructor(public readonly applicationId: string) {
    super(applicationId);
  }
}

export class EmployerRegistered extends DomainEvent {
  constructor(public readonly employerId: string) {
    super(employerId);
  }
}

export class DonationReceived extends DomainEvent {
  constructor(public readonly transactionId: string) {
    super(transactionId);
  }
}

export class CampaignCreated extends DomainEvent {
  constructor(public readonly campaignId: string) {
    super(campaignId);
  }
}

export class EventPublished extends DomainEvent {
  constructor(public readonly eventId: string) {
    super(eventId);
  }
}

export class EventCompleted extends DomainEvent {
  constructor(public readonly eventId: string) {
    super(eventId);
  }
}

export class CommunityCreated extends DomainEvent {
  constructor(public readonly communityId: string) {
    super(communityId);
  }
}

export class VolunteerJoined extends DomainEvent {
  constructor(public readonly volunteerId: string) {
    super(volunteerId);
  }
}
