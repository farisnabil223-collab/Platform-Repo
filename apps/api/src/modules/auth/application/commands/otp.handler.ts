import { BadRequestException, Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7, OtpGeneratedEvent, OtpVerifiedEvent, DomainEventBus } from '@eduverse/kernel';
import * as crypto from 'crypto';

@Injectable()
export class OtpHandler {
  async sendOtp(email: string, purpose: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    // Deactivate previous OTPs for the same purpose
    await prisma.otpCode.deleteMany({
      where: { userId: user.id, purpose },
    });

    // Save hashed OTP
    await prisma.otpCode.create({
      data: {
        id: generateUuidV7(),
        userId: user.id,
        codeHash,
        purpose,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes TTL
        attemptLimit: 3,
      },
    });

    // Publish event
    await DomainEventBus.getInstance().publish(new OtpGeneratedEvent(user.id, purpose));

    return code; // In production, this would be sent via SMS/Email, here we return it
  }

  async verifyOtp(email: string, code: string, purpose: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otpRecord = await prisma.otpCode.findFirst({
      where: { userId: user.id, purpose },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException('No active OTP found');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP code has expired');
    }

    const submittedHash = crypto.createHash('sha256').update(code).digest('hex');
    if (otpRecord.codeHash !== submittedHash) {
      // Increment attempt count
      const updatedAttempts = otpRecord.attempts + 1;
      if (updatedAttempts >= otpRecord.attemptLimit) {
        await prisma.otpCode.delete({ where: { id: otpRecord.id } });
        throw new BadRequestException('Too many failed attempts. Code invalidated.');
      } else {
        await prisma.otpCode.update({
          where: { id: otpRecord.id },
          data: { attempts: updatedAttempts },
        });
      }
      throw new BadRequestException('Invalid OTP code');
    }

    // Success, delete the used code
    await prisma.otpCode.delete({ where: { id: otpRecord.id } });

    // Publish event
    await DomainEventBus.getInstance().publish(new OtpVerifiedEvent(user.id, purpose));
  }
}
