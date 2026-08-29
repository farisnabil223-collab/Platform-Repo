import { Body, Controller, Get, Post, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import {
  StudentSuccessProfileRepository,
  AcademicRiskAssessmentRepository,
  AdvisorAssignmentRepository,
  AdvisorNoteRepository,
  InterventionPlanRepository,
  StudentJourneyRepository,
  CareerProfileRepository
} from '@eduverse/database';
import {
  generateUuidV7,
  StudentSuccessProfile,
  AcademicRiskAssessment,
  AdvisorAssignment,
  AdvisorNote,
  InterventionPlan,
  StudentJourney,
  CareerProfile,
  SlaTracker
} from '@eduverse/kernel';

@ApiTags('Student Success & Academic Intelligence')
@Controller('academic-intel')
export class AcademicIntelController {
  private readonly successRepo = new StudentSuccessProfileRepository();
  private readonly riskRepo = new AcademicRiskAssessmentRepository();
  private readonly assignmentRepo = new AdvisorAssignmentRepository();
  private readonly noteRepo = new AdvisorNoteRepository();
  private readonly planRepo = new InterventionPlanRepository();
  private readonly journeyRepo = new StudentJourneyRepository();
  private readonly careerRepo = new CareerProfileRepository();
  private readonly slaTracker = new SlaTracker();

  // 1. Success Score Calculator
  @Post('student-success/calculate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Calculate or update student success metrics score' })
  async calculateSuccessScore(@Request() req: any, @Body() body: {
    studentId: string;
    successScore: number;
    engagementScore: number;
    customFormula?: string;
  }) {
    const profile = new StudentSuccessProfile(generateUuidV7(), {
      tenantId: req.user.tenantId,
      studentId: body.studentId,
      successScore: body.successScore,
      engagementScore: body.engagementScore,
      customFormula: body.customFormula ?? 'DEFAULT',
      graduationReady: body.successScore >= 0.85,
    });
    await this.successRepo.save(profile);
    return { success: true, profileId: profile.id, graduationReady: profile.graduationReady };
  }

  // 2. Advisor Assignment
  @Post('advisors/assign')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign advisor to target student' })
  async assignAdvisor(@Request() req: any, @Body() body: {
    studentId: string;
    advisorId: string;
  }) {
    const assignment = new AdvisorAssignment(generateUuidV7(), {
      tenantId: req.user.tenantId,
      studentId: body.studentId,
      advisorId: body.advisorId,
      status: 'ACTIVE',
    });
    await this.assignmentRepo.save(assignment);
    return { success: true, assignmentId: assignment.id };
  }

  // 3. Advisor Notes
  @Post('advisors/notes')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create advisor note for target student' })
  async createAdvisorNote(@Request() req: any, @Body() body: {
    studentId: string;
    advisorId: string;
    noteContent: string;
  }) {
    const note = new AdvisorNote(generateUuidV7(), {
      tenantId: req.user.tenantId,
      studentId: body.studentId,
      advisorId: body.advisorId,
      noteContent: body.noteContent,
    });
    await this.noteRepo.save(note);
    return { success: true, noteId: note.id };
  }

  // 4. Intervention Plans
  @Post('interventions/plans')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register academic intervention plan with SLA tracker' })
  async createInterventionPlan(@Request() req: any, @Body() body: {
    studentId: string;
    assignedTo: string;
    description: string;
    slaDeadline: string;
  }) {
    const deadlineDate = new Date(body.slaDeadline);

    const initialPlan = new InterventionPlan(generateUuidV7(), {
      tenantId: req.user.tenantId,
      studentId: body.studentId,
      assignedTo: body.assignedTo,
      description: body.description,
      slaDeadline: deadlineDate,
      escalationLevel: 'LEVEL_1',
      status: 'IN_PROGRESS',
    });

    // Check SLA deadline to evaluate initial escalation level
    const finalEscalation = this.slaTracker.evaluateEscalation({
      id: initialPlan.id,
      slaDeadline: initialPlan.slaDeadline,
      status: initialPlan.status,
      escalationLevel: initialPlan.escalationLevel,
    });

    const plan = new InterventionPlan(initialPlan.id, {
      tenantId: initialPlan.tenantId,
      studentId: initialPlan.studentId,
      assignedTo: initialPlan.assignedTo,
      description: initialPlan.description,
      slaDeadline: initialPlan.slaDeadline,
      escalationLevel: finalEscalation,
      status: initialPlan.status,
    });

    await this.planRepo.save(plan);
    return { success: true, planId: plan.id, escalationLevel: plan.escalationLevel };
  }

  // 5. Student Journey timeline
  @Get('student-journey/:studentId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get timeline logs of student journey milestones' })
  async getStudentJourney(@Request() req: any, @Param('studentId') studentId: string) {
    const list = await this.journeyRepo.findManyByStudentId(studentId);
    return list.map(item => ({
      id: item.id,
      milestone: item.milestone,
      category: item.category,
    }));
  }

  // 6. Career Profile setup
  @Post('career/profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update student career readiness index and skill gaps' })
  async updateCareerProfile(@Request() req: any, @Body() body: {
    studentId: string;
    employabilityScore: number;
    skillGapJson: any;
  }) {
    const profile = new CareerProfile(generateUuidV7(), {
      tenantId: req.user.tenantId,
      studentId: body.studentId,
      employabilityScore: body.employabilityScore,
      skillGapJson: body.skillGapJson,
    });
    await this.careerRepo.save(profile);
    return { success: true, profileId: profile.id };
  }
}
