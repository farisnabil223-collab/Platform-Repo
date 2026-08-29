import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StorageService } from '../storage/storage.service';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

class UploadObjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bucketId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key!: string;

  @ApiProperty()
  @IsNumber()
  size!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  checksum!: string;
}

@ApiTags('Cloud Multi-Provider Storage')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Register uploaded cloud object' })
  async upload(@Body() dto: UploadObjectDto) {
    const obj = await this.storageService.uploadObject(
      dto.bucketId,
      dto.key,
      dto.size,
      dto.mimeType,
      dto.checksum,
    );
    return { success: true, data: obj };
  }

  @Get('object/:id')
  @ApiOperation({ summary: 'Fetch cloud storage object mapping' })
  async getObject(@Param('id') id: string) {
    const obj = await this.storageService.getObject(id);
    return { success: true, data: obj };
  }

  @Delete('object/:id')
  @ApiOperation({ summary: 'Delete cloud storage object metadata' })
  async deleteObject(@Param('id') id: string) {
    const obj = await this.storageService.deleteObject(id);
    return { success: true, data: obj };
  }
}
