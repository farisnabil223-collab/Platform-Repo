import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import {
  AlumniProfileRepository,
  AlumniChapterLeaderRepository,
  CareerResumeRepository,
  EmployerAccountRepository,
  JobPostingRepository,
  JobApplicationRepository,
  MentorshipProgramRepository,
  MentorshipSessionRepository,
  CommunityPostRepository,
  CrmContactRepository,
  AlumniEventRepository,
  EventRegistrationRepository,
  DonationCampaignRepository,
  DonationTransactionRepository
} from '@eduverse/database';
import {
  generateUuidV7,
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
  DonationTransaction,
  MentorshipMatcher,
  HiringPipelineValidator,
  DomainEventBus,
  AlumniRegistered,
  AlumniVerified,
  MentorAssigned,
  MentorshipStarted,
  JobPosted,
  ApplicationSubmitted,
  EmployerRegistered,
  DonationReceived,
  CampaignCreated,
  EventPublished
} from '@eduverse/kernel';

@ApiTags('Alumni, Advancement & Engagement')
@Controller('alumni')
export class AlumniController {
  private readonly profileRepo = new AlumniProfileRepository();
  private readonly leaderRepo = new AlumniChapterLeaderRepository();
  private readonly resumeRepo = new CareerResumeRepository();
  private readonly employerRepo = new EmployerAccountRepository();
  private readonly jobRepo = new JobPostingRepository();
  private readonly applicationRepo = new JobApplicationRepository();
  private readonly programRepo = new MentorshipProgramRepository();
  private readonly sessionRepo = new MentorshipSessionRepository();
  private readonly postRepo = new CommunityPostRepository();
  private readonly contactRepo = new CrmContactRepository();
  private readonly eventRepo = new AlumniEventRepository();
  private readonly registrationRepo = new EventRegistrationRepository();
  private readonly campaignRepo = new DonationCampaignRepository();
  private readonly txRepo = new DonationTransactionRepository();

  private readonly matcher = new MentorshipMatcher();
  private readonly pipelineValidator = new HiringPipelineValidator();

  // 1. Alumni Profiles
  @Post('profiles')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register proposed alumni profile details' })
  async proposeProfile(@Request() req: any, @Body() body: {
    graduationYear: number;
    chapterName: string;
  }) {
    const profile = new AlumniProfile(generateUuidV7(), {
      tenantId: req.user.tenantId,
      userId: req.user.id,
      graduationYear: body.graduationYear,
      verificationState: 'PENDING',
      chapterName: body.chapterName,
    });
    await this.profileRepo.save(profile);
    await DomainEventBus.getInstance().publish(new AlumniRegistered(profile.id));
    return { success: true, profileId: profile.id, verificationState: profile.verificationState };
  }

  @Post('profiles/verify')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify alumni graduation records requirements' })
  async verifyProfile(@Request() req: any, @Body() body: { profileId: string }) {
    const profile = await this.profileRepo.findById(body.profileId);
    if (!profile) {
      throw new BadRequestException('Alumni profile not found');
    }

    const verified = new AlumniProfile(profile.id, {
      tenantId: profile.tenantId,
      userId: profile.userId,
      graduationYear: profile.graduationYear,
      verificationState: 'VERIFIED',
      chapterName: profile.chapterName,
    });
    await this.profileRepo.save(verified);
    await DomainEventBus.getInstance().publish(new AlumniVerified(verified.id));
    return { success: true, profileId: verified.id, verificationState: verified.verificationState };
  }

  // 2. Chapters Leaders
  @Post('chapters/leaders')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Map chapters leader roles' })
  async assignLeader(@Request() req: any, @Body() body: {
    chapterId: string;
    userId: string;
    role: string;
  }) {
    const leader = new AlumniChapterLeader(generateUuidV7(), {
      tenantId: req.user.tenantId,
      chapterId: body.chapterId,
      userId: body.userId,
      role: body.role,
    });
    await this.leaderRepo.save(leader);
    return { success: true, leaderId: leader.id };
  }

  // 3. Career Resumes versions
  @Post('resumes')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save resume file versions' })
  async uploadResume(@Request() req: any, @Body() body: {
    fileUrl: string;
    version: number;
  }) {
    const resume = new CareerResume(generateUuidV7(), {
      tenantId: req.user.tenantId,
      userId: req.user.id,
      fileUrl: body.fileUrl,
      version: body.version,
    });
    await this.resumeRepo.save(resume);
    return { success: true, resumeId: resume.id };
  }

  // 4. Employers Accounts
  @Post('employers')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register corporate employer company details' })
  async registerEmployer(@Request() req: any, @Body() body: {
    companyName: string;
    industry: string;
    website: string;
  }) {
    const employer = new EmployerAccount(generateUuidV7(), {
      tenantId: req.user.tenantId,
      companyName: body.companyName,
      industry: body.industry,
      website: body.website,
    });
    await this.employerRepo.save(employer);
    await DomainEventBus.getInstance().publish(new EmployerRegistered(employer.id));
    return { success: true, employerId: employer.id };
  }

  // 5. Job Postings
  @Post('jobs')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Post hiring vacancy position' })
  async postJob(@Request() req: any, @Body() body: {
    employerId: string;
    title: string;
    salary: number;
  }) {
    const job = new JobPosting(generateUuidV7(), {
      tenantId: req.user.tenantId,
      employerId: body.employerId,
      title: body.title,
      salary: body.salary,
      status: 'OPEN',
    });
    await this.jobRepo.save(job);
    await DomainEventBus.getInstance().publish(new JobPosted(job.id));
    return { success: true, jobId: job.id };
  }

  @Post('jobs/apply')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply for job vacancy' })
  async applyJob(@Request() req: any, @Body() body: { jobPostingId: string }) {
    const app = new JobApplication(generateUuidV7(), {
      tenantId: req.user.tenantId,
      jobPostingId: body.jobPostingId,
      userId: req.user.id,
      pipelineStep: 'APPLIED',
    });
    await this.applicationRepo.save(app);
    await DomainEventBus.getInstance().publish(new ApplicationSubmitted(app.id));
    return { success: true, applicationId: app.id };
  }

  @Post('jobs/pipeline')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Advance application in pipeline step' })
  async advancePipeline(@Request() req: any, @Body() body: {
    applicationId: string;
    nextStep: string;
  }) {
    const app = await this.applicationRepo.findById(body.applicationId);
    if (!app) {
      throw new BadRequestException('Job application not found');
    }

    this.pipelineValidator.validateStepTransition(app.pipelineStep, body.nextStep);

    const updated = new JobApplication(app.id, {
      tenantId: app.tenantId,
      jobPostingId: app.jobPostingId,
      userId: app.userId,
      pipelineStep: body.nextStep,
    });
    await this.applicationRepo.save(updated);
    return { success: true, applicationId: updated.id, pipelineStep: updated.pipelineStep };
  }

  // 6. Mentorship matching requests
  @Post('mentorship/requests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign matched mentorship program' })
  async assignMentor(@Request() req: any, @Body() body: {
    mentorId: string;
    studentId: string;
  }) {
    const program = new MentorshipProgram(generateUuidV7(), {
      tenantId: req.user.tenantId,
      mentorId: body.mentorId,
      studentId: body.studentId,
      status: 'ACTIVE',
    });
    await this.programRepo.save(program);
    await DomainEventBus.getInstance().publish(new MentorAssigned(program.mentorId, program.studentId));
    await DomainEventBus.getInstance().publish(new MentorshipStarted(program.id));
    return { success: true, programId: program.id };
  }

  @Post('mentorship/sessions')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule mentorship session checking availability conflicts' })
  async scheduleSession(@Request() req: any, @Body() body: {
    mentorId: string;
    studentId: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) {
    const start = new Date(body.startTime);
    const end = new Date(body.endTime);

    // Fetch existing sessions for the mentor
    const existing = await this.sessionRepo.findManyByMentorId(body.mentorId);

    // Verify slots availability
    this.matcher.verifyAvailability({
      mentorId: body.mentorId,
      startTime: start,
      endTime: end,
    }, existing.map(s => ({
      mentorId: s.mentorId,
      startTime: s.startTime,
      endTime: s.endTime,
    })));

    const session = new MentorshipSession(generateUuidV7(), {
      tenantId: req.user.tenantId,
      mentorId: body.mentorId,
      studentId: body.studentId,
      startTime: start,
      endTime: end,
      notes: body.notes,
      status: 'SCHEDULED',
    });
    await this.sessionRepo.save(session);
    return { success: true, sessionId: session.id };
  }

  // 7. Community platform
  @Post('community/posts')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish post in interest community' })
  async publishPost(@Request() req: any, @Body() body: { content: string }) {
    const post = new CommunityPost(generateUuidV7(), {
      tenantId: req.user.tenantId,
      userId: req.user.id,
      content: body.content,
      isBlocked: false,
    });
    await this.postRepo.save(post);
    return { success: true, postId: post.id };
  }

  // 8. Fundraising Campaigns & Donations
  @Post('fundraising/campaigns')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create corporate sponsorship fundraising campaign' })
  async createCampaign(@Request() req: any, @Body() body: {
    title: string;
    targetGoal: number;
  }) {
    const campaign = new DonationCampaign(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      targetGoal: body.targetGoal,
      raisedAmt: 0.0,
    });
    await this.campaignRepo.save(campaign);
    await DomainEventBus.getInstance().publish(new CampaignCreated(campaign.id));
    return { success: true, campaignId: campaign.id };
  }

  @Post('fundraising/donations')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process donation transaction receipts' })
  async processDonation(@Request() req: any, @Body() body: {
    campaignId: string;
    amount: number;
    isRecurring?: boolean;
  }) {
    const tx = new DonationTransaction(generateUuidV7(), {
      tenantId: req.user.tenantId,
      campaignId: body.campaignId,
      donorId: req.user.id,
      amount: body.amount,
      isRecurring: body.isRecurring ?? false,
    });
    await this.txRepo.save(tx);
    await DomainEventBus.getInstance().publish(new DonationReceived(tx.id));
    return { success: true, transactionId: tx.id };
  }

  // 9. Events Platform
  @Post('events')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Announce reunions chapters events' })
  async publishEvent(@Request() req: any, @Body() body: {
    title: string;
    eventDate: string;
  }) {
    const event = new AlumniEvent(generateUuidV7(), {
      tenantId: req.user.tenantId,
      title: body.title,
      eventDate: new Date(body.eventDate),
    });
    await this.eventRepo.save(event);
    await DomainEventBus.getInstance().publish(new EventPublished(event.id));
    return { success: true, eventId: event.id };
  }
}
