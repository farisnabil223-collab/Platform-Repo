import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DeviceLifecycleService } from '../device/device-lifecycle.service';
import { IsString, IsNotEmpty } from 'class-validator';

class RegisterDeviceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orgId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  platform!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  manufacturer!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  model!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  osVersion!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  appVersion!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  locale!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timezone!: string;
}

class BlockDeviceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId!: string;
}

@ApiTags('Mobile Device Management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('mobile/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceLifecycleService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register or update device details' })
  async register(@Body() dto: RegisterDeviceDto) {
    const dev = await this.deviceService.registerDevice(dto);
    return { success: true, data: dev };
  }

  @Post('block')
  @ApiOperation({ summary: 'Block a mobile device by device ID' })
  async block(@Body() dto: BlockDeviceDto) {
    const dev = await this.deviceService.blockDevice(dto.deviceId);
    return { success: true, data: dev };
  }
}
