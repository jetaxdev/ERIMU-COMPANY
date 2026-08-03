import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

type RequestWithUser = Request & {
  user?: Awaited<ReturnType<AuthService['verifyAccessToken']>>;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.getToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    request.user = await this.authService.verifyAccessToken(token);
    return true;
  }

  private getToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    return this.getCookie(request.headers.cookie, AuthService.accessTokenCookieName);
  }

  private getCookie(cookieHeader: string | undefined, name: string): string | undefined {
    if (!cookieHeader) {
      return undefined;
    }

    return cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${name}=`))
      ?.slice(name.length + 1);
  }
}
