import { Controller, Get, Post, Body, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IChatProvider, IContentGenerationProvider } from '../domain/ai-providers.interface';
import { IsString, IsNotEmpty } from 'class-validator';

class SendChatMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message!: string;
}

class GenerateLessonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  topic!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gradeLevel!: string;
}

@ApiTags('AI Platform Capabilities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ai')
export class AiController {
  constructor(
    @Inject(IChatProvider) private readonly chatProvider: IChatProvider,
    @Inject(IContentGenerationProvider) private readonly generationProvider: IContentGenerationProvider
  ) {}

  @Post('chat')
  @ApiOperation({ summary: 'Send message to AI Guided Tutor Chat' })
  async sendChatMessage(@Body() dto: SendChatMessageDto) {
    const result = await this.chatProvider.sendMessage(dto.sessionId, dto.message);
    return { success: true, data: result };
  }

  @Post('lesson-generation')
  @ApiOperation({ summary: 'Generate lesson content outlines for teachers' })
  async generateLesson(@Body() dto: GenerateLessonDto) {
    const html = await this.generationProvider.generateLessonContent(dto.topic, dto.gradeLevel);
    return { success: true, data: { html } };
  }
}
