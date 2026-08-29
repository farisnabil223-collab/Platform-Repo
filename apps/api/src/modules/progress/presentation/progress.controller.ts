import { Body, Controller, Get, Param, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@eduverse/security';
import { CompleteLessonHandler } from '../application/commands/complete-lesson.handler';
import { TrackWatchHeartbeatHandler } from '../application/commands/track-watch-heartbeat.handler';
import { CreateBookmarkHandler } from '../application/commands/create-bookmark.handler';
import { HeartbeatDto, BookmarkDto, CompleteLessonDto } from '../dto/progress.dto';
import { prisma } from '@eduverse/database';

@ApiTags('Progress Tracking')
@Controller('learning')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class ProgressController {
  constructor(
    private readonly completeLessonHandler: CompleteLessonHandler,
    private readonly trackWatchHeartbeatHandler: TrackWatchHeartbeatHandler,
    private readonly createBookmarkHandler: CreateBookmarkHandler
  ) {}

  @Post('lessons/:id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a lesson completed and update course progress' })
  async completeLesson(@Param('id') id: string, @Body() dto: CompleteLessonDto) {
    await this.completeLessonHandler.execute(id, dto.studentId);
    return { success: true };
  }

  @Post('media/:id/heartbeat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update student media playback offset heartbeat' })
  async trackHeartbeat(@Param('id') id: string, @Body() dto: HeartbeatDto) {
    await this.trackWatchHeartbeatHandler.execute(id, dto.studentId, dto.secondsOffset);
    return { success: true };
  }

  @Post('lessons/:id/bookmarks')
  @ApiOperation({ summary: 'Create a bookmark flag at a lesson timestamp' })
  async createBookmark(@Param('id') id: string, @Body() dto: BookmarkDto) {
    return this.createBookmarkHandler.execute(id, dto);
  }

  @Get('resume')
  @ApiOperation({ summary: 'Retrieve last accessed course outline coordinates for resuming' })
  @ApiQuery({ name: 'studentId' })
  @ApiQuery({ name: 'courseId' })
  async resumeLearning(
    @Query('studentId') studentId: string,
    @Query('courseId') courseId: string
  ) {
    const progress = await prisma.courseProgress.findFirst({
      where: { studentId, courseId },
      include: {
        version: true,
      },
    });

    return {
      percentage: progress?.percentage || 0,
      lastLessonId: progress?.lastLessonId || null,
      lastAccessedAt: progress?.lastAccessedAt || null,
      structure: progress?.version.structure || null,
    };
  }
}
