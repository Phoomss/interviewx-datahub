import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // 1. Check for Bearer Token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const payload = this.authService.verifyJwt(token);
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        fullName: payload.fullName,
      };
      return true;
    }

    // 2. Allow Internal Service Key for machine-to-machine calls (AI Service <-> Backend)
    const internalKey = request.headers['x-internal-service-key'];
    const expectedKey = this.config.get<string>(
      'INTERNAL_SERVICE_KEY',
      'interviewx_internal_service_secret_key_2026',
    );
    if (internalKey && internalKey === expectedKey) {
      request.user = {
        id: 'system-internal-service',
        email: 'internal-service@interviewx.local',
        role: 'ADMIN',
        fullName: 'InterviewX Internal Service',
      };
      return true;
    }

    throw new UnauthorizedException(
      'จำเป็นต้องเข้าสู่ระบบก่อนใช้งาน (Missing or Invalid Bearer Token)',
    );
  }
}
