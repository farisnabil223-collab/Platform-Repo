import { Controller, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

class CreateApiClientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orgId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secretHash!: string;
}

class CreateApiKeyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @ApiProperty()
  @IsArray()
  scopes!: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  expiresAt!: string;
}

@ApiTags('Client Integrations & API Keys')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api-keys')
export class ApiKeysController {
  @Post('api-clients')
  @ApiOperation({ summary: 'Register a new external API integration client' })
  async createClient(@Body() dto: CreateApiClientDto) {
    const client = await prisma.apiClient.create({
      data: {
        id: generateUuidV7(),
        organizationId: dto.orgId,
        clientId: dto.clientId,
        secretHash: dto.secretHash,
        status: 'ACTIVE',
      },
    });
    return { success: true, data: client };
  }

  @Post('api-keys')
  @ApiOperation({ summary: 'Generate a scoped API token for client' })
  async createKey(@Body() dto: CreateApiKeyDto) {
    const key = await prisma.apiKey.create({
      data: {
        id: generateUuidV7(),
        tenantId: generateUuidV7(),
        keyHash: dto.clientId,
        apiClientId: dto.clientId,
      },
    });
    return { success: true, data: key };
  }

  @Delete('api-keys/:id')
  @ApiOperation({ summary: 'Revoke external API token' })
  async deleteKey(@Param('id') id: string) {
    await prisma.apiKey.delete({ where: { id } });
    return { success: true };
  }
}
