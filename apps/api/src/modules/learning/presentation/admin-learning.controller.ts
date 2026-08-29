import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

class CreateLearningPathDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug!: string;
}

@ApiTags('Admin Learning & Analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('admin/learning')
export class AdminLearningController {
  @Get('analytics')
  @ApiOperation({ summary: 'Get aggregated student learning analytics' })
  async getAnalytics() {
    const totalWatchTime = await prisma.learningAnalytics.aggregate({
      _sum: { watchTime: true },
    });

    const completionRate = await prisma.lessonProgress.aggregate({
      _count: { id: true },
      where: { isCompleted: true },
    });

    const totalStudents = await prisma.student.count();

    return {
      success: true,
      data: {
        totalWatchTimeSeconds: totalWatchTime._sum.watchTime || 0,
        completedLessonsCount: completionRate._count.id || 0,
        enrolledStudentsCount: totalStudents,
        averageEngagementScore: totalStudents > 0 ? (completionRate._count.id || 0) / totalStudents : 0,
      },
    };
  }

  @Post('paths')
  @ApiOperation({ summary: 'Create a learning path sequence' })
  async createLearningPath(@Body() dto: CreateLearningPathDto) {
    const path = await prisma.learningPath.create({
      data: {
        id: generateUuidV7(),
        title: dto.title,
        description: dto.description,
        slug: dto.slug,
      },
    });

    return {
      success: true,
      message: 'Learning path created successfully',
      data: path,
    };
  }
}
