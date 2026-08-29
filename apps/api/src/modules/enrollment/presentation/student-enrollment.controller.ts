import { Controller, Post, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { prisma } from '@eduverse/database';
import { DomainEventBus, generateUuidV7 } from '@eduverse/kernel';
import { EnrollmentCreatedEvent } from '../domain/events/enrollment-created.event';
import { AuditLogService } from '../../audit/application/audit-log.service';

@ApiTags('Student Enrollments')
@Controller('student/enrollments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('STUDENT')
@ApiBearerAuth()
export class StudentEnrollmentController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Post()
  @ApiOperation({ summary: 'Enroll currently authenticated student into a course' })
  async enroll(@Req() req: any, @Body('courseId') courseId: string) {
    const userId = req.user.sub || req.user.id;

    if (!courseId) {
      throw new BadRequestException('courseId is required');
    }

    // Find student profile
    const student = await prisma.student.findUnique({
      where: { userId },
    });
    if (!student) {
      throw new BadRequestException('Student profile not found for this user');
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new BadRequestException('Course not found');
    }

    // Get default section or create a default one
    let section = await prisma.section.findFirst({
      where: { deletedAt: null },
    });
    if (!section) {
      // Find or create default Academic Year
      let academicYear = await prisma.academicYear.findFirst({
        where: { deletedAt: null },
      });
      if (!academicYear) {
        academicYear = await prisma.academicYear.create({
          data: {
            id: generateUuidV7(),
            name: 'Academic Year 2026',
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000),
          },
        });
      }

      let classroom = await prisma.classroom.findFirst();
      if (!classroom) {
        classroom = await prisma.classroom.create({
          data: {
            id: generateUuidV7(),
            code: 'CR-DEFAULT',
            name: 'Default General Classroom',
            capacity: 30,
          },
        });
      }

      const gradeId = student.gradeId || (await prisma.grade.findFirst())?.id || generateUuidV7();

      // Create default Section
      section = await prisma.section.create({
        data: {
          id: generateUuidV7(),
          code: 'SEC-DEFAULT',
          name: 'Default General Section',
          gradeId: gradeId,
          classroomId: classroom.id,
        },
      });
    }

    // Check if student is already enrolled
    const existing = await prisma.studentEnrollment.findFirst({
      where: {
        studentId: student.id,
        sectionId: section.id,
        deletedAt: null,
      },
    });

    if (existing) {
      return {
        id: existing.id,
        enrolled: true,
        message: 'Already enrolled in this section.',
      };
    }

    // Get default Academic Year if section was pre-existing but we need it for enrollment
    let academicYear = await prisma.academicYear.findFirst({
      where: { deletedAt: null },
    });
    if (!academicYear) {
      academicYear = await prisma.academicYear.create({
        data: {
          id: generateUuidV7(),
          name: 'Academic Year 2026',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000),
        },
      });
    }

    const enrollmentId = generateUuidV7();
    const enrollment = await prisma.studentEnrollment.create({
      data: {
        id: enrollmentId,
        studentId: student.id,
        sectionId: section.id,
        academicYearId: academicYear.id,
        enrollmentNumber: 'ENR-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        status: 'ACTIVE',
      },
    });

    // Emit Domain Event
    const event = new EnrollmentCreatedEvent(enrollmentId, student.id, courseId);
    await DomainEventBus.getInstance().publish(event);

    // Audit Trail
    await this.auditLogService.log({
      userId,
      action: 'ENROLLMENT_CREATED',
      entity: 'StudentEnrollment',
      entityId: enrollmentId,
      details: { courseId, studentId: student.id },
    });

    return {
      id: enrollment.id,
      enrolled: true,
      message: 'Successfully enrolled in course section.',
    };
  }
}
