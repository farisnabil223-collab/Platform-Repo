import { ConflictException, Injectable } from '@nestjs/common';
import { RoleRepository } from '@eduverse/database';
import { Role, generateUuidV7, RoleCreatedEvent, DomainEventBus } from '@eduverse/kernel';
import { CreateRoleDto } from '../../dto/role.dto';

@Injectable()
export class CreateRoleHandler {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(dto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException('Role already exists');
    }

    const role = new Role(generateUuidV7(), {
      name: dto.name,
      description: dto.description,
      permissionIds: [],
    });

    await this.roleRepository.save(role);

    // Publish event
    await DomainEventBus.getInstance().publish(new RoleCreatedEvent(role.id, role.name));

    return role;
  }
}
