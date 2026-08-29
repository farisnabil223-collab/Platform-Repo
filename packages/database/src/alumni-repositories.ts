import { prisma } from './index';
import { BaseTenantRepository } from './base-tenant-repository';
import {
  AlumniProfile,
  AlumniChapterLeader,
  CareerResume,
  EmployerAccount,
  JobPosting,
  JobApplication,
  MentorshipProgram,
  MentorshipSession,
  CommunityPost,
  CrmContact,
  AlumniEvent,
  EventRegistration,
  DonationCampaign,
  DonationTransaction
} from '@eduverse/kernel';

export class AlumniProfileRepository extends BaseTenantRepository {
  async save(profile: AlumniProfile): Promise<void> {
    await prisma.alumniProfile.upsert({
      where: { id: profile.id },
      update: { verificationState: profile.verificationState },
      create: {
        id: profile.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: profile.userId,
        graduationYear: profile.graduationYear,
        verificationState: profile.verificationState,
        chapterName: profile.chapterName,
      },
    });
  }

  async findById(id: string): Promise<AlumniProfile | null> {
    const row = await prisma.alumniProfile.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new AlumniProfile(row.id, {
      tenantId: row.tenantId,
      userId: row.userId,
      graduationYear: row.graduationYear,
      verificationState: row.verificationState,
      chapterName: row.chapterName,
    });
  }
}

export class AlumniChapterLeaderRepository extends BaseTenantRepository {
  async save(leader: AlumniChapterLeader): Promise<void> {
    await prisma.alumniChapterLeader.upsert({
      where: { id: leader.id },
      update: { role: leader.role },
      create: {
        id: leader.id,
        tenantId: this.getTenantIdOrThrow(),
        chapterId: leader.chapterId,
        userId: leader.userId,
        role: leader.role,
      },
    });
  }
}

export class CareerResumeRepository extends BaseTenantRepository {
  async save(resume: CareerResume): Promise<void> {
    await prisma.careerResume.upsert({
      where: { id: resume.id },
      update: { version: resume.versionNumber },
      create: {
        id: resume.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: resume.userId,
        fileUrl: resume.fileUrl,
        version: resume.versionNumber,
      },
    });
  }
}

export class EmployerAccountRepository extends BaseTenantRepository {
  async save(account: EmployerAccount): Promise<void> {
    await prisma.employerAccount.upsert({
      where: { id: account.id },
      update: { companyName: account.companyName },
      create: {
        id: account.id,
        tenantId: this.getTenantIdOrThrow(),
        companyName: account.companyName,
        industry: account.industry,
        website: account.website,
      },
    });
  }
}

export class JobPostingRepository extends BaseTenantRepository {
  async save(job: JobPosting): Promise<void> {
    await prisma.jobPosting.upsert({
      where: { id: job.id },
      update: { status: job.status },
      create: {
        id: job.id,
        tenantId: this.getTenantIdOrThrow(),
        employerId: job.employerId,
        title: job.title,
        salary: job.salary,
        status: job.status,
      },
    });
  }
}

export class JobApplicationRepository extends BaseTenantRepository {
  async save(app: JobApplication): Promise<void> {
    await prisma.jobApplication.upsert({
      where: { id: app.id },
      update: { pipelineStep: app.pipelineStep },
      create: {
        id: app.id,
        tenantId: this.getTenantIdOrThrow(),
        jobPostingId: app.jobPostingId,
        userId: app.userId,
        pipelineStep: app.pipelineStep,
      },
    });
  }

  async findById(id: string): Promise<JobApplication | null> {
    const row = await prisma.jobApplication.findFirst({
      where: { id, tenantId: this.getTenantIdOrThrow() },
    });
    if (!row) return null;
    return new JobApplication(row.id, {
      tenantId: row.tenantId,
      jobPostingId: row.jobPostingId,
      userId: row.userId,
      pipelineStep: row.pipelineStep,
    });
  }
}

export class MentorshipProgramRepository extends BaseTenantRepository {
  async save(program: MentorshipProgram): Promise<void> {
    await prisma.mentorshipProgram.upsert({
      where: { id: program.id },
      update: { status: program.status },
      create: {
        id: program.id,
        tenantId: this.getTenantIdOrThrow(),
        mentorId: program.mentorId,
        studentId: program.studentId,
        status: program.status,
      },
    });
  }
}

export class MentorshipSessionRepository extends BaseTenantRepository {
  async save(session: MentorshipSession): Promise<void> {
    await prisma.mentorshipSession.upsert({
      where: { id: session.id },
      update: { status: session.status },
      create: {
        id: session.id,
        tenantId: this.getTenantIdOrThrow(),
        mentorId: session.mentorId,
        studentId: session.studentId,
        startTime: session.startTime,
        endTime: session.endTime,
        notes: session.notes,
        status: session.status,
      },
    });
  }

  async findManyByMentorId(mentorId: string): Promise<MentorshipSession[]> {
    const rows = await prisma.mentorshipSession.findMany({
      where: { mentorId, tenantId: this.getTenantIdOrThrow() },
    });
    return rows.map(row => new MentorshipSession(row.id, {
      tenantId: row.tenantId,
      mentorId: row.mentorId,
      studentId: row.studentId,
      startTime: row.startTime,
      endTime: row.endTime,
      notes: row.notes ?? undefined,
      status: row.status,
    }));
  }
}

export class CommunityPostRepository extends BaseTenantRepository {
  async save(post: CommunityPost): Promise<void> {
    await prisma.communityPost.upsert({
      where: { id: post.id },
      update: { isBlocked: post.isBlocked },
      create: {
        id: post.id,
        tenantId: this.getTenantIdOrThrow(),
        userId: post.userId,
        content: post.content,
        isBlocked: post.isBlocked,
      },
    });
  }
}

export class CrmContactRepository extends BaseTenantRepository {
  async save(contact: CrmContact): Promise<void> {
    await prisma.crmContact.upsert({
      where: { id: contact.id },
      update: { name: contact.name },
      create: {
        id: contact.id,
        tenantId: this.getTenantIdOrThrow(),
        name: contact.name,
        email: contact.email,
      },
    });
  }
}

export class AlumniEventRepository extends BaseTenantRepository {
  async save(event: AlumniEvent): Promise<void> {
    await prisma.alumniEvent.upsert({
      where: { id: event.id },
      update: { title: event.title },
      create: {
        id: event.id,
        tenantId: this.getTenantIdOrThrow(),
        title: event.title,
        eventDate: event.eventDate,
      },
    });
  }
}

export class EventRegistrationRepository extends BaseTenantRepository {
  async save(reg: EventRegistration): Promise<void> {
    await prisma.eventRegistration.upsert({
      where: { id: reg.id },
      update: { attended: reg.attended },
      create: {
        id: reg.id,
        tenantId: this.getTenantIdOrThrow(),
        eventId: reg.eventId,
        userId: reg.userId,
        attended: reg.attended,
      },
    });
  }
}

export class DonationCampaignRepository extends BaseTenantRepository {
  async save(campaign: DonationCampaign): Promise<void> {
    await prisma.donationCampaign.upsert({
      where: { id: campaign.id },
      update: { raisedAmt: campaign.raisedAmt },
      create: {
        id: campaign.id,
        tenantId: this.getTenantIdOrThrow(),
        title: campaign.title,
        targetGoal: campaign.targetGoal,
        raisedAmt: campaign.raisedAmt,
      },
    });
  }
}

export class DonationTransactionRepository extends BaseTenantRepository {
  async save(tx: DonationTransaction): Promise<void> {
    await prisma.donationTransaction.upsert({
      where: { id: tx.id },
      update: { amount: tx.amount },
      create: {
        id: tx.id,
        tenantId: this.getTenantIdOrThrow(),
        campaignId: tx.campaignId,
        donorId: tx.donorId,
        amount: tx.amount,
        isRecurring: tx.isRecurring,
      },
    });
  }
}
