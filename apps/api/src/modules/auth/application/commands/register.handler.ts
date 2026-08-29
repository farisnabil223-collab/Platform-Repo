import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '@eduverse/database';
import { User, generateUuidV7, UserRegisteredEvent, DomainEventBus } from '@eduverse/kernel';
import { HashUtility, PasswordPolicy } from '@eduverse/security';
import { RegisterDto } from '../../dto/register.dto';
import { prisma } from '@eduverse/database';
import { JwtService } from '@eduverse/security';
import { getJwtSecret } from '../../../../config/env.config';

@Injectable()
export class RegisterHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(dto: RegisterDto): Promise<{ userId: string; verificationToken: string }> {
    // 1. Password Policy check
    const isPasswordPolicyValid = PasswordPolicy.validate(dto.password, {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    });
    if (!isPasswordPolicyValid) {
      throw new BadRequestException(
        'Password does not meet complexity requirements (min 8 chars, 1 uppercase, 1 number, 1 special character)'
      );
    }

    // 2. Uniqueness check
    const existingEmail = await this.userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }

    if (dto.phone) {
      const existingPhone = await this.userRepository.findByPhone(dto.phone);
      if (existingPhone) {
        throw new ConflictException('Phone number is already registered');
      }
    }

    // 3. Argon2 hash
    const passwordHash = await HashUtility.hash(dto.password);
    const userId = generateUuidV7();

    // 4. Create User Aggregate Root
    const user = new User(userId, {
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      isActive: true,
      isLocked: false,
      emailVerified: false,
    });

    // 5. Save to database inside unit of work or transaction (User + role mapping)
    await prisma.$transaction(async (tx) => {
      // Find role
      let roleRecord = await tx.role.findFirst({
        where: { name: dto.role.toUpperCase() },
      });
      if (!roleRecord) {
        roleRecord = await tx.role.create({
          data: {
            id: generateUuidV7(),
            name: dto.role.toUpperCase(),
            description: `${dto.role} system role`,
          },
        });
      }

      // Save user
      await tx.user.create({
        data: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          passwordHash: user.passwordHash,
          isActive: user.isActive,
          isLocked: user.isLocked,
          emailVerified: user.emailVerified,
          version: user.version,
        },
      });

      // Save user role join
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: roleRecord.id,
        },
      });
    });

    // 6. Generate signed verification token
    const verificationToken = this.jwtService.sign(
      { sub: user.id, purpose: 'EMAIL_VERIFICATION' },
      { expiresIn: '24h', secret: getJwtSecret() }
    );

    // Save token hash to DB
    const crypto = require('crypto');
    const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
    await prisma.emailVerification.create({
      data: {
        id: generateUuidV7(),
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // 7. Publish Domain Event
    const event = new UserRegisteredEvent(user.id, user.email);
    await DomainEventBus.getInstance().publish(event);

    return { userId: user.id, verificationToken };
  }
}
