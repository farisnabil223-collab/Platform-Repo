import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { ParentService } from '../application/parent.service';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

class LinkStudentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  relationshipType!: string;
}

class SetPreferenceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  notificationType!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  channel!: string;
}

@ApiTags('Parent Portal')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'View parent dashboard details' })
  async getDashboard(@Request() req: any) {
    const parent = await prisma.parent.findUniqueOrThrow({
      where: { userId: req.user.id },
    });

    const students = await prisma.parentStudent.findMany({
      where: { parentId: parent.id },
      include: { student: true },
    });

    return {
      success: true,
      data: {
        parent,
        linkedStudents: students,
      },
    };
  }

  @Post('students/link')
  @ApiOperation({ summary: 'Link parent account to student' })
  async linkStudent(@Body() dto: LinkStudentDto, @Request() req: any) {
    let parent = await prisma.parent.findUnique({
      where: { userId: req.user.id },
    });

    if (!parent) {
      parent = await prisma.parent.create({
        data: {
          id: generateUuidV7(),
          organizationId: req.user.organizationId || 'default-org-uuid',
          userId: req.user.id,
        },
      });
    }

    const link = await this.parentService.linkStudent(parent.id, dto.studentId, dto.relationshipType);
    return { success: true, data: link };
  }

  @Get('activities')
  @ApiOperation({ summary: 'Get parent portal activity logs' })
  async getActivities(@Request() req: any) {
    const parent = await prisma.parent.findUniqueOrThrow({
      where: { userId: req.user.id },
    });

    const list = await prisma.parentActivity.findMany({
      where: { parentId: parent.id },
    });

    return { success: true, data: list };
  }

  @Post('preferences')
  @ApiOperation({ summary: 'Save parent notification preferences' })
  async savePreference(@Body() dto: SetPreferenceDto, @Request() req: any) {
    const parent = await prisma.parent.findUniqueOrThrow({
      where: { userId: req.user.id },
    });

    const pref = await prisma.parentNotificationPreference.create({
      data: {
        id: generateUuidV7(),
        parentId: parent.id,
        notificationType: dto.notificationType,
        channel: dto.channel,
      },
    });

    return { success: true, data: pref };
  }
}
