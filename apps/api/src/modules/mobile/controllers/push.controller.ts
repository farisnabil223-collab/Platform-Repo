import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { IsString, IsNotEmpty } from 'class-validator';

class RegisterPushTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  provider!: string; // FCM, APNS

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token!: string;
}

class SubscribeTopicDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  topicName!: string;
}

@ApiTags('Mobile Push Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('mobile/push')
export class PushController {
  @Post('register')
  @ApiOperation({ summary: 'Register push token FCM/APNS' })
  async registerToken(@Body() dto: RegisterPushTokenDto) {
    const token = await prisma.pushToken.upsert({
      where: { deviceId: dto.deviceId },
      update: { token: dto.token, provider: dto.provider },
      create: {
        id: generateUuidV7(),
        deviceId: dto.deviceId,
        provider: dto.provider,
        token: dto.token,
      },
    });
    return { success: true, data: token };
  }

  @Post('topics')
  @ApiOperation({ summary: 'Subscribe to a notification topic' })
  async subscribeTopic(@Body() dto: SubscribeTopicDto) {
    const sub = await prisma.notificationTopic.create({
      data: {
        id: generateUuidV7(),
        deviceId: dto.deviceId,
        topicName: dto.topicName,
      },
    });
    return { success: true, data: sub };
  }
}
