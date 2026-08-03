import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedUser } from './types/authenticated-user';

@Injectable()
export class AuthService {
  static readonly accessTokenCookieName = 'erimu_access_token';

  constructor(private readonly prisma: PrismaService) {}

  health() {
    return { status: 'ok', module: 'auth' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email.toLowerCase() },
    });

    const passwordMatches = user
      ? await bcrypt.compare(loginDto.password, user.password)
      : false;

    if (!user || !passwordMatches || !this.isAdminRole(user.role)) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const authenticatedUser = this.toAuthenticatedUser(user);
    const accessToken = this.signAccessToken(authenticatedUser);

    return { accessToken, user: authenticatedUser };
  }

  async verifyAccessToken(token: string): Promise<AuthenticatedUser> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;
      const userId = payload.sub;

      if (typeof userId !== 'string') {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !this.isAdminRole(user.role)) {
        throw new UnauthorizedException('Invalid token');
      }

      return this.toAuthenticatedUser(user);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: this.accessTokenMaxAgeSeconds * 1000,
    };
  }

  getClearCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };
  }

  private signAccessToken(user: AuthenticatedUser) {
    const options: jwt.SignOptions = {
      subject: user.id,
      expiresIn: this.accessTokenExpiresIn as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign(
      {
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      this.jwtSecret,
      options,
    );
  }

  private toAuthenticatedUser(user: {
    id: string;
    email: string;
    fullName: string | null;
    role: Role;
    companyId: string | null;
  }): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      companyId: user.companyId,
    };
  }

  private isAdminRole(role: Role) {
    return role === Role.SUPER_ADMIN || role === Role.ADMIN || role === Role.MANAGER;
  }

  private get jwtSecret() {
    return process.env.JWT_SECRET || 'change-me-in-production';
  }

  private get accessTokenExpiresIn() {
    return process.env.JWT_EXPIRES_IN || '1d';
  }

  private get accessTokenMaxAgeSeconds() {
    const oneDay = 60 * 60 * 24;
    const configured = Number(process.env.JWT_COOKIE_MAX_AGE_SECONDS);
    return Number.isFinite(configured) && configured > 0 ? configured : oneDay;
  }
}
