import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { IsString, IsNotEmpty } from 'class-validator';

class ConfigurePlatformDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  globalSmtp!: string;
}

@ApiTags('Platform Administration')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tenants/platform-health')
export class PlatformController {
  @Get('organizations')
  @ApiOperation({ summary: 'List all SaaS organizations' })
  async getOrganizations() {
    const list = await prisma.organization.findMany();
    return { success: true, data: list };
  }

  @Post('config')
  @ApiOperation({ summary: 'Configure global Platform SMTP' })
  async configurePlatform(@Body() dto: ConfigurePlatformDto) {
    const config = await prisma.platformConfiguration.create({
      data: {
        id: generateUuidV7(),
        globalSmtp: dto.globalSmtp,
      },
    });

    return { success: true, data: config };
  }
}
