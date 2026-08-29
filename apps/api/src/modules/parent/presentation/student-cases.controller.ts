import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { CaseManagementService } from '../application/case-management.service';
import { IsString, IsNotEmpty } from 'class-validator';

class CreateCaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  priority!: string;
}

class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  assigneeId!: string;
}

@ApiTags('Student Success Cases')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('student-cases')
export class StudentCasesController {
  constructor(private readonly caseService: CaseManagementService) {}

  @Post()
  @ApiOperation({ summary: 'Open a new success case' })
  async openCase(@Body() dto: CreateCaseDto) {
    const caseRecord = await this.caseService.openCase('default-org-uuid', dto.studentId, dto.priority);
    return { success: true, data: caseRecord };
  }

  @Get()
  @ApiOperation({ summary: 'List student success cases' })
  async getCases(@Query('studentId') studentId: string) {
    const list = await prisma.studentCase.findMany({
      where: { studentId },
      include: { tasks: true },
    });
    return { success: true, data: list };
  }

  @Post(':id/tasks')
  @ApiOperation({ summary: 'Add follow-up task to case' })
  async addTask(@Param('id') id: string, @Body() dto: CreateTaskDto) {
    const task = await this.caseService.addTask(id, dto.title, dto.assigneeId);
    return { success: true, data: task };
  }
}
