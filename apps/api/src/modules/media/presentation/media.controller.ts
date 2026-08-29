import { Body, Controller, Get, Param, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '@eduverse/security';
import { IngestMediaHandler } from '../application/commands/ingest-media.handler';
import { RetryMediaJobHandler } from '../application/commands/retry-media-job.handler';
import { IngestMediaDto } from '../dto/media.dto';
import { prisma } from '@eduverse/database';

@ApiTags('Media Ingestion')
@Controller('media')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(
    private readonly ingestMediaHandler: IngestMediaHandler,
    private readonly retryMediaJobHandler: RetryMediaJobHandler
  ) {}

  @Post()
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Ingest a new media asset reference' })
  async ingestMedia(@Body() dto: IngestMediaDto) {
    return this.ingestMediaHandler.execute(dto);
  }

  @Post(':id/retry')
  @HttpCode(HttpStatus.OK)
  @Roles('TEACHER', 'ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Retry a failed media processing job' })
  async retryJob(@Param('id') id: string) {
    await this.retryMediaJobHandler.execute(id);
    return { success: true };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve media asset processing metadata details' })
  async getMedia(@Param('id') id: string) {
    return prisma.mediaAsset.findUnique({
      where: { id },
      include: { jobs: true },
    });
  }
}
