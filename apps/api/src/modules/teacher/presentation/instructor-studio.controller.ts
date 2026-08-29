import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { CourseDuplicationEngine } from '../application/course-duplication.engine';
import { MediaLibraryService } from '../application/media-library.service';
import { PublishingWorkflowService } from '../application/publishing-workflow.service';
import { EditingLockService } from '../domain/editing-lock.service';
import { ContentQualityService } from '../domain/content-quality.service';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}

class CloneCourseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newTitle!: string;
}

class CreateSectionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sortOrder!: number;
}

class CreateLessonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sectionId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sortOrder!: number;
}

class CreateFolderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  parentId?: string;
}

class UploadAssetDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storagePath!: string;
}

class SchedulePublishDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  scheduledAt!: string;
}

class SubmitCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contentReviewId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;
}

@ApiTags('Instructor Teacher Studio')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('instructor')
export class InstructorStudioController {
  constructor(
    private readonly duplicationEngine: CourseDuplicationEngine,
    private readonly mediaService: MediaLibraryService,
    private readonly publishingService: PublishingWorkflowService,
    private readonly lockService: EditingLockService,
    private readonly qualityService: ContentQualityService
  ) {}

  // --- Courses ---
  @Post('courses')
  @ApiOperation({ summary: 'Create new course' })
  async createCourse(@Body() dto: CreateCourseDto, @Request() req: any) {
    const code = 'C-' + Math.floor(1000 + Math.random() * 9000);
    const slug = dto.title.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(2, 5);

    // Ensure teacher exists
    let teacher = await prisma.teacher.findUnique({
      where: { userId: req.user.id },
    });

    if (!teacher) {
      teacher = await prisma.teacher.create({
        data: {
          id: generateUuidV7(),
          userId: req.user.id,
          teacherCode: 'TCH-' + Math.floor(1000 + Math.random() * 9000),
        },
      });
    }

    const course = await prisma.course.create({
      data: {
        id: generateUuidV7(),
        code,
        slug,
        title: dto.title,
        description: dto.description || '',
        status: 'DRAFT',
        teacherId: teacher.id,
      },
    });
    return { success: true, data: course };
  }

  @Post('courses/:id/clone')
  @ApiOperation({ summary: 'Clone course structure' })
  async cloneCourse(@Param('id') id: string, @Body() dto: CloneCourseDto) {
    const cloned = await this.duplicationEngine.cloneCourse(id, dto.newTitle);
    return { success: true, data: cloned };
  }

  // --- Curriculum ---
  @Post('curriculum/sections')
  @ApiOperation({ summary: 'Add curriculum section' })
  async addSection(@Body() dto: CreateSectionDto) {
    const code = 'MOD-' + Math.floor(1000 + Math.random() * 9000);
    const section = await prisma.module.create({
      data: {
        id: generateUuidV7(),
        courseId: dto.courseId,
        code,
        title: dto.title,
        sortOrder: dto.sortOrder,
      },
    });
    return { success: true, data: section };
  }

  // --- Lessons ---
  @Post('lessons')
  @ApiOperation({ summary: 'Add lesson to section' })
  async addLesson(@Body() dto: CreateLessonDto) {
    const code = 'LES-' + Math.floor(10000 + Math.random() * 90000);
    const lesson = await prisma.lesson.create({
      data: {
        id: generateUuidV7(),
        moduleId: dto.sectionId,
        code,
        title: dto.title,
        sortOrder: dto.sortOrder,
        estimatedDuration: 300,
      },
    });
    return { success: true, data: lesson };
  }

  @Post('lessons/:id/lock')
  @ApiOperation({ summary: 'Acquire editing lock on lesson' })
  async lockLesson(@Param('id') id: string, @Request() req: any) {
    const lock = await this.lockService.acquireLock(id, req.user.id);
    return { success: true, data: lock };
  }

  @Delete('lessons/:id/lock')
  @ApiOperation({ summary: 'Release editing lock on lesson' })
  async unlockLesson(@Param('id') id: string, @Request() req: any) {
    await this.lockService.releaseLock(id, req.user.id);
    return { success: true };
  }

  // --- Media Library ---
  @Post('media/folders')
  @ApiOperation({ summary: 'Create media folder' })
  async createFolder(@Body() dto: CreateFolderDto) {
    const folder = await this.mediaService.createFolder(dto.name, dto.parentId);
    return { success: true, data: folder };
  }

  @Post('media/upload')
  @ApiOperation({ summary: 'Upload file to media library' })
  async uploadAsset(@Body() dto: UploadAssetDto) {
    const asset = await this.mediaService.uploadAsset(dto.title, 'LOCAL', dto.storagePath);
    return { success: true, data: asset };
  }

  @Get('media')
  @ApiOperation({ summary: 'List media folders and files' })
  async listMedia() {
    const list = await this.mediaService.listFolders();
    return { success: true, data: list };
  }

  // --- Publishing & Review ---
  @Post('publishing/submit/:courseId')
  @ApiOperation({ summary: 'Submit course outline for editorial review' })
  async submitPublishing(@Param('courseId') courseId: string) {
    const wf = await this.publishingService.submitForReview(courseId);
    return { success: true, data: wf };
  }

  @Post('publishing/schedule/:courseId')
  @ApiOperation({ summary: 'Schedule automatic publication date' })
  async schedulePublishing(@Param('courseId') courseId: string, @Body() dto: SchedulePublishDto) {
    const sched = await this.publishingService.schedulePublish(courseId, new Date(dto.scheduledAt));
    return { success: true, data: sched };
  }

  @Post('reviews/comment')
  @ApiOperation({ summary: 'Add review thread comment' })
  async addReviewComment(@Body() dto: SubmitCommentDto, @Request() req: any) {
    const comment = await prisma.reviewComment.create({
      data: {
        id: generateUuidV7(),
        contentReviewId: dto.contentReviewId,
        authorId: req.user.id,
        content: dto.content,
      },
    });
    return { success: true, data: comment };
  }

  // --- Instructor Dashboard ---
  @Get('dashboard')
  @ApiOperation({ summary: 'Aggregate instructor courses statistics' })
  async getDashboard() {
    const coursesCount = await prisma.course.count();
    const reviewsCount = await prisma.contentReview.count();
    return {
      success: true,
      data: {
        totalCourses: coursesCount,
        pendingReviews: reviewsCount,
      },
    };
  }
}
