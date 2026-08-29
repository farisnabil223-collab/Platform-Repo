import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '@eduverse/database';
import { prisma } from '@eduverse/database';
import { HashUtility, PasswordPolicy } from '@eduverse/security';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { generateUuidV7, PasswordChangedEvent, DomainEventBus } from '@eduverse/kernel';

@Injectable()
export class ChangePasswordHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // 1. Verify current password
    const isCurrentValid = await HashUtility.verify(dto.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new BadRequestException('Invalid current password');
    }

    // 2. Validate new password policy
    const isNewValid = PasswordPolicy.validate(dto.newPassword, {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    });
    if (!isNewValid) {
      throw new BadRequestException('New password does not meet complexity requirements');
    }

    // 3. Password History check (prevent reuse of last 3 passwords)
    const histories = await prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    for (const hist of histories) {
      const match = await HashUtility.verify(dto.newPassword, hist.passwordHash);
      if (match) {
        throw new BadRequestException('Cannot reuse any of your last 3 passwords');
      }
    }

    // 4. Save old password to history
    await prisma.passwordHistory.create({
      data: {
        id: generateUuidV7(),
        userId,
        passwordHash: user.passwordHash,
      },
    });

    // 5. Update user password
    const newHash = await HashUtility.hash(dto.newPassword);
    user.changePassword(newHash);
    await this.userRepository.save(user);

    // 6. Publish event
    await DomainEventBus.getInstance().publish(new PasswordChangedEvent(user.id));
  }
}
