import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CourseNavigationService } from '../application/course-navigation.service';
import { LearningProgressService } from '../application/learning-progress.service';
import { StudentNotesService } from '../application/student-notes.service';
import { StudentBookmarksService } from '../application/student-bookmarks.service';
import { LessonResourcesService } from '../application/lesson-resources.service';
import { LessonTranscriptsService } from '../application/lesson-transcripts.service';
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

class SyncProgressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lessonId!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  timeWatched!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  duration!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  resumePosition!: number;
}

class CreateNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lessonId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text!: string;
}

class CreateBookmarkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lessonId!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  secondsOffset!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  noteText?: string;
}

@ApiTags('Student Learning Experience')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student/learning')
export class StudentLearningController {
  constructor(
    private readonly navigationService: CourseNavigationService,
    private readonly progressService: LearningProgressService,
    private readonly notesService: StudentNotesService,
    private readonly bookmarksService: StudentBookmarksService,
    private readonly resourcesService: LessonResourcesService,
    private readonly transcriptsService: LessonTranscriptsService
  ) {}

  @Get('learning/courses/:courseId/structure')
  @ApiOperation({ summary: 'Get course sections and lesson lock statuses' })
  async getCourseStructure(@Param('courseId') courseId: string, @Request() req: any) {
    const data = await this.navigationService.getCourseStructure(req.user.id, courseId);
    return { success: true, data };
  }

  @Get('lessons/:lessonId/navigation')
  @ApiOperation({ summary: 'Get sibling lessons next/prev navigation links' })
  async getLessonNavigation(@Param('lessonId') lessonId: string, @Request() req: any) {
    const data = await this.navigationService.getLessonNavigation(req.user.id, lessonId);
    return { success: true, data };
  }

  @Post('progress/sync')
  @ApiOperation({ summary: 'Sync lesson watch progress duration' })
  async syncProgress(@Body() dto: SyncProgressDto, @Request() req: any) {
    const data = await this.progressService.syncProgress(
      req.user.id,
      dto.lessonId,
      dto.timeWatched,
      dto.duration,
      dto.resumePosition
    );
    return { success: true, data };
  }

  @Get('notes')
  @ApiOperation({ summary: 'List notes for a lesson' })
  async getNotes(@Query('lessonId') lessonId: string, @Request() req: any) {
    const data = await this.notesService.getNotes(req.user.id, lessonId);
    return { success: true, data };
  }

  @Post('notes')
  @ApiOperation({ summary: 'Create a timestamped lesson note' })
  async createNote(@Body() dto: CreateNoteDto, @Request() req: any) {
    const data = await this.notesService.createNote(req.user.id, dto.lessonId, dto.text);
    return { success: true, data };
  }

  @Delete('notes/:id')
  @ApiOperation({ summary: 'Delete note' })
  async deleteNote(@Param('id') id: string) {
    const data = await this.notesService.deleteNote(id);
    return { success: true, data };
  }

  @Get('bookmarks')
  @ApiOperation({ summary: 'List bookmarks for a lesson' })
  async getBookmarks(@Query('lessonId') lessonId: string, @Request() req: any) {
    const data = await this.bookmarksService.getBookmarks(req.user.id, lessonId);
    return { success: true, data };
  }

  @Post('bookmarks')
  @ApiOperation({ summary: 'Create a lesson bookmark' })
  async createBookmark(@Body() dto: CreateBookmarkDto, @Request() req: any) {
    const data = await this.bookmarksService.createBookmark(
      req.user.id,
      dto.lessonId,
      dto.secondsOffset,
      dto.noteText
    );
    return { success: true, data };
  }

  @Delete('bookmarks/:id')
  @ApiOperation({ summary: 'Delete bookmark' })
  async deleteBookmark(@Param('id') id: string) {
    const data = await this.bookmarksService.deleteBookmark(id);
    return { success: true, data };
  }

  @Get('resources')
  @ApiOperation({ summary: 'List downloadable resources for a lesson' })
  async getResources(@Query('lessonId') lessonId: string) {
    const data = await this.resourcesService.getResources(lessonId);
    return { success: true, data };
  }

  @Get('resources/:id/download')
  @ApiOperation({ summary: 'Generate signed download link' })
  async getDownloadUrl(@Param('id') id: string) {
    const url = await this.resourcesService.getDownloadUrl(id);
    return { success: true, data: { url } };
  }

  @Get('transcripts/:lessonId')
  @ApiOperation({ summary: 'Get transcripts for a lesson' })
  async getTranscript(@Param('lessonId') lessonId: string, @Query('language') language?: string) {
    const data = await this.transcriptsService.getTranscript(lessonId, language || 'en');
    return { success: true, data };
  }
}
