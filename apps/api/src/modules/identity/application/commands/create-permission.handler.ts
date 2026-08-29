import { ConflictException, Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7, PermissionCreatedEvent, DomainEventBus } from '@eduverse/kernel';
import { CreatePermissionDto } from '../../dto/permission.dto';

@Injectable()
export class CreatePermissionHandler {
  async execute(dto: CreatePermissionDto) {
    const nameUpper = dto.name.toUpperCase();
    const existing = await prisma.permission.findFirst({
      where: { name: nameUpper },
    });
    if (existing) {
      throw new ConflictException('Permission already exists');
    }

    const permission = await prisma.permission.create({
      data: {
        id: generateUuidV7(),
        name: nameUpper,
        description: dto.description,
      },
    });

    // Publish event
    await DomainEventBus.getInstance().publish(new PermissionCreatedEvent(permission.id, permission.name));

    return permission;
  }
}
