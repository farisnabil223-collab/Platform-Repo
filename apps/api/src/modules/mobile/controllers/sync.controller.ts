import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OfflineSyncEngine } from '../sync/offline-sync-engine.service';
import { IsString, IsNotEmpty, IsNumber, IsObject } from 'class-validator';

class DeltaSyncDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty()
  @IsNumber()
  lastVersion!: number;
}

class ResolveConflictDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  entityType!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty()
  @IsNumber()
  clientVersion!: number;

  @ApiProperty()
  @IsObject()
  clientData!: any;
}

@ApiTags('Mobile Synchronization Engine')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('mobile/sync')
export class SyncController {
  constructor(private readonly syncEngine: OfflineSyncEngine) {}

  @Post('delta')
  @ApiOperation({ summary: 'Request incremental sync delta changes' })
  async getDelta(@Body() dto: DeltaSyncDto) {
    const list = await this.syncEngine.computeSync(dto.deviceId, dto.lastVersion);
    return { success: true, data: list };
  }

  @Post('resolve')
  @ApiOperation({ summary: 'Resolve client-server synchronization conflicts' })
  async resolve(@Body() dto: ResolveConflictDto) {
    const res = await this.syncEngine.resolveConflict(
      dto.entityType,
      dto.entityId,
      dto.clientVersion,
      dto.clientData
    );
    return { success: true, data: res };
  }
}
