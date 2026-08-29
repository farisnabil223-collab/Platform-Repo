import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository, SessionRepository, DeviceRepository } from '@eduverse/database';
import { Session, Device, generateUuidV7, UserLoggedInEvent, DomainEventBus } from '@eduverse/kernel';
import { HashUtility, JwtService } from '@eduverse/security';
import { LoginDto } from '../../dto/login.dto';
import { prisma } from '@eduverse/database';
import * as crypto from 'crypto';
import { getJwtSecret } from '../../../../config/env.config';

@Injectable()
export class LoginHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly deviceRepository: DeviceRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(dto: LoginDto, ipAddress: string | null, userAgent: string | null): Promise<{
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 1. Check account lockout state
    if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
      throw new UnauthorizedException(`Account is temporarily locked. Try again after ${user.lockUntil.toISOString()}`);
    }

    // 2. Verify password
    const isPasswordValid = await HashUtility.verify(dto.password, user.passwordHash);

    // Record login attempt
    await prisma.loginAttempt.create({
      data: {
        id: generateUuidV7(),
        userId: user.id,
        ipAddress,
        success: isPasswordValid,
      },
    });

    if (!isPasswordValid) {
      // Fetch consecutive failures to evaluate lock
      const failures = await prisma.loginAttempt.count({
        where: {
          userId: user.id,
          success: false,
          createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) }, // 15 mins
        },
      });

      if (failures >= 5) {
        user.lock(new Date(Date.now() + 15 * 60 * 1000)); // lock for 15 mins
        await this.userRepository.save(user);
        throw new UnauthorizedException('Too many failed attempts. Account locked for 15 minutes.');
      }

      throw new UnauthorizedException('Invalid email or password');
    }

    // Password is valid, clear locks if any
    if (user.isLocked) {
      user.unlock();
      await this.userRepository.save(user);
    }

    // 3. Register or Update Device aggregate
    let device = await this.deviceRepository.findByUserIdAndHash(user.id, dto.deviceHash);
    if (!device) {
      device = new Device(generateUuidV7(), {
        userId: user.id,
        deviceHash: dto.deviceHash,
        name: dto.deviceName || 'Unknown Device',
        browser: dto.browser || 'Unknown Browser',
        os: dto.os || 'Unknown OS',
        ipAddress,
        lastActivity: new Date(),
        isTrusted: false,
      });
    } else {
      device.updateActivity(ipAddress);
    }
    await this.deviceRepository.save(device);

    // 4. Create Session Aggregate
    const sessionId = generateUuidV7();
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionTokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');

    // 5 minutes idle timeout, absolute expiry 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = new Session(sessionId, {
      userId: user.id,
      tokenHash: sessionTokenHash,
      userAgent,
      ipAddress,
      isExpired: false,
      expiresAt,
      lastActivity: new Date(),
    });
    await this.sessionRepository.save(session);

    // Fetch user roles
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true },
    });
    const rolesList = userRoles.map((ur) => ur.role.name.toUpperCase());

    // 5. Generate JWT Access Token with claims
    const jti = generateUuidV7();
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: rolesList.join(','),
        roles: rolesList,
        sessionId,
      },
      {
        secret: getJwtSecret(),
        jwtid: jti,
        issuer: 'eduverse-identity',
        audience: 'eduverse-clients',
        expiresIn: '15m', // 15 mins expiry
      }
    );

    // 6. Generate Refresh Token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const familyId = generateUuidV7();

    await prisma.refreshToken.create({
      data: {
        id: generateUuidV7(),
        userId: user.id,
        tokenHash: refreshTokenHash,
        familyId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // 7. Publish Domain Event
    const event = new UserLoggedInEvent(user.id, ipAddress);
    await DomainEventBus.getInstance().publish(event);

    return {
      accessToken,
      refreshToken,
      sessionId,
    };
  }
}
