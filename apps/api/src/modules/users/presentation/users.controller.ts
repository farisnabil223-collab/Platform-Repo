import { Body, Controller, Get, Post, Req, UseGuards, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordHandler } from '../application/commands/change-password.handler';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { prisma } from '@eduverse/database';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { generateUuidV7, DomainEventBus } from '@eduverse/kernel';
import { UserRegisteredEvent } from '../domain/events/user-registered.event';

export class CompleteProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  grade!: string;

  @IsString()
  @IsNotEmpty()
  school!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  learningGoal!: string;

  @IsString()
  @IsNotEmpty()
  language!: string;

  @IsString()
  @IsOptional()
  studentCode?: string;
}

@ApiTags('User Profiles')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly changePasswordHandler: ChangePasswordHandler) {}

  @Get('me')
  @ApiOperation({ summary: 'Retrieve currently authenticated user profile' })
  async getProfile(@Req() req: any) {
    const userId = req.user.sub || req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
    });
    return user;
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user account password' })
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const userId = req.user.sub || req.user.id;
    await this.changePasswordHandler.execute(userId, dto);
    return { success: true };
  }

  @Post('complete-profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete student profile details during onboarding' })
  async completeProfile(@Req() req: any, @Body() dto: CompleteProfileDto) {
    const userId = req.user.sub || req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { phone: dto.phone },
    });

    let student = await prisma.student.findUnique({
      where: { userId },
    });

    let grade = await prisma.grade.findFirst({
      where: {
        OR: [
          { level: dto.grade },
          { name: { contains: dto.grade, mode: 'insensitive' } }
        ]
      }
    });

    if (!grade) {
      grade = await prisma.grade.findFirst();
      if (!grade) {
        grade = await prisma.grade.create({
          data: {
            id: generateUuidV7(),
            level: dto.grade,
            name: dto.grade,
          }
        });
      }
    }

    const academicMetadata = {
      name: `${dto.firstName} ${dto.lastName}`,
      school: dto.school,
      city: dto.city,
      learningGoal: dto.learningGoal,
      language: dto.language,
    };

    if (student) {
      student = await prisma.student.update({
        where: { id: student.id },
        data: {
          studentCode: dto.studentCode || student.studentCode,
          gradeId: grade.id,
          academicMetadata,
        },
      });
    } else {
      student = await prisma.student.create({
        data: {
          id: generateUuidV7(),
          userId,
          studentCode: dto.studentCode || `EV-${Date.now()}`,
          gradeId: grade.id,
          status: 'ACTIVE',
          academicMetadata,
        },
      });
    }

    const event = new UserRegisteredEvent(userId, user.email, 'STUDENT');
    await DomainEventBus.getInstance().publish(event);

    return {
      success: true,
      user: {
        name: `${dto.firstName} ${dto.lastName}`,
        email: user.email,
        role: 'STUDENT',
        permissions: [],
      },
    };
  }
}
