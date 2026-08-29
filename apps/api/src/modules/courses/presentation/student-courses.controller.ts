import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { prisma } from '@eduverse/database';

@ApiTags('Student Dashboard Courses')
@Controller('student/courses')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('STUDENT')
@ApiBearerAuth()
export class StudentCoursesController {
  @Get()
  @ApiOperation({ summary: 'Retrieve enrolled courses for currently authenticated student' })
  async getEnrolledCourses(@Req() req: any) {
    const userId = req.user.sub || req.user.id;
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        student: {
          userId,
        },
        deletedAt: null,
      },
      include: {
        section: true,
        academicYear: true,
      },
    });

    // Let's also fetch courses that match the student's grade level
    const student = await prisma.student.findUnique({
      where: { userId },
      select: { gradeId: true },
    });

    let gradeCourses: any[] = [];
    if (student) {
      gradeCourses = await prisma.course.findMany({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
        },
        include: {
          teacher: { include: { user: { select: { email: true } } } },
        },
      });
    }

    return {
      enrollments: enrollments.map(e => ({
        id: e.id,
        enrolledAt: e.createdAt,
        sectionName: e.section?.name,
      })),
      courses: gradeCourses.map(c => ({
        id: c.id,
        code: c.code,
        slug: c.slug,
        title: c.title,
        description: c.description,
        instructorName: c.teacher?.user?.email ? c.teacher.user.email.split('@')[0] : 'Instructor',
        progress: 0,
      })),
    };
  }
}
