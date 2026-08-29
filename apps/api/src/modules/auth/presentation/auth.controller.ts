import { Body, Controller, Post, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { RegisterHandler } from '../application/commands/register.handler';
import { LoginHandler } from '../application/commands/login.handler';
import { RefreshHandler } from '../application/commands/refresh.handler';
import { LogoutHandler } from '../application/commands/logout.handler';
import { OtpHandler } from '../application/commands/otp.handler';
import { VerifyEmailHandler } from '../application/commands/verify-email.handler';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshDto } from '../dto/refresh.dto';
import { SendOtpDto, VerifyOtpDto } from '../dto/otp.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authentication & Sessions')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerHandler: RegisterHandler,
    private readonly loginHandler: LoginHandler,
    private readonly refreshHandler: RefreshHandler,
    private readonly logoutHandler: LogoutHandler,
    private readonly otpHandler: OtpHandler,
    private readonly verifyEmailHandler: VerifyEmailHandler
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async register(@Body() dto: RegisterDto) {
    return this.registerHandler.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user credentials and retrieve token pair' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = req.ip || null;
    const ua = req.headers['user-agent'] || null;
    return this.loginHandler.execute(dto, ip, ua);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token family and obtain new access token' })
  async refresh(@Body() dto: RefreshDto) {
    return this.refreshHandler.execute(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke active user sessions' })
  async logout(@Req() req: any) {
    const user = req.user;
    const sessionId = user?.sessionId || null;
    const userId = user?.sub || user?.id;
    const jti = user?.jti || undefined;
    const exp = user?.exp || undefined;
    return this.logoutHandler.execute(userId, sessionId, false, jti, exp);
  }

  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send generated OTP code to user' })
  async sendOtp(@Body() dto: SendOtpDto) {
    const code = await this.otpHandler.sendOtp(dto.email, dto.purpose);
    // In production, we'd email/SMS it, here we return it for Swagger testing convenience
    return { code };
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify generated OTP code purpose' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.otpHandler.verifyOtp(dto.email, dto.code, dto.purpose);
    return { verified: true };
  }

  @Post('email/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email using signed token' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.verifyEmailHandler.execute(dto.token);
    return { verified: true };
  }
}
