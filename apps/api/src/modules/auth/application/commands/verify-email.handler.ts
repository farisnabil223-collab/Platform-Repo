import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { UserRepository } from '@eduverse/database';
import { JwtService } from '@eduverse/security';
import * as crypto from 'crypto';
import { getJwtSecret } from '../../../../config/env.config';

@Injectable()
export class VerifyEmailHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(token: string): Promise<void> {
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: getJwtSecret(),
      });
    } catch {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (payload.purpose !== 'EMAIL_VERIFICATION') {
      throw new BadRequestException('Invalid token purpose');
    }

    const userId = payload.sub;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find token record in DB
    const verificationRecord = await prisma.emailVerification.findUnique({
      where: { tokenHash },
    });

    if (!verificationRecord || verificationRecord.expiresAt < new Date()) {
      throw new BadRequestException('Verification token has expired or already been used');
    }

    // Verify user aggregate
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.verifyEmail();
    await this.userRepository.save(user);

    // Clean up verification token record
    await prisma.emailVerification.delete({
      where: { id: verificationRecord.id },
    });
  }
}
