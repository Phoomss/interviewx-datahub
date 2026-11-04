import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  fullName: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: Buffer;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const secret =
      this.config.get<string>('JWT_SECRET') ||
      'interviewx_jwt_secret_production_key_minimum_32bytes!';
    this.jwtSecret = crypto.createHash('sha256').update(secret).digest();
  }

  async onModuleInit() {
    await this.seedDefaultAdminIfEmpty();
  }

  /**
   * สร้างบัญชีผู้ดูแลระบบตั้งต้น (Initial Admin Seed) หากยังไม่มีในระบบ
   */
  async seedDefaultAdminIfEmpty() {
    try {
      const adminCount = await this.prisma.user.count({
        where: { role: UserRole.ADMIN },
      });

      if (adminCount === 0) {
        const defaultAdminEmail = this.config.get<string>(
          'DEFAULT_ADMIN_EMAIL',
          'admin@interviewx.internal',
        );
        const defaultAdminPassword = this.config.get<string>(
          'DEFAULT_ADMIN_PASSWORD',
          'AdminPassword2026!',
        );

        const passwordHash = this.hashPassword(defaultAdminPassword);
        await this.prisma.user.upsert({
          where: { email: defaultAdminEmail },
          update: { role: UserRole.ADMIN },
          create: {
            email: defaultAdminEmail,
            passwordHash,
            fullName: 'System Administrator (DPO)',
            role: UserRole.ADMIN,
            isActive: true,
          },
        });
        this.logger.log(`Initialized default Administrator account: ${defaultAdminEmail}`);
      }
    } catch (err: any) {
      this.logger.debug(`Admin user seed deferred: ${err.message}`);
    }
  }

  /**
   * แฮชรหัสผ่านด้วย PBKDF2 (SHA-512) พร้อม Salt 16 bytes
   */
  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * ตรวจสอบรหัสผ่านกับค่าแฮชที่บันทึกไว้ในฐานข้อมูล (Timing-Safe)
   */
  verifyPassword(password: string, storedHash: string): boolean {
    if (!storedHash || !storedHash.includes(':')) return false;
    try {
      const [salt, originalHash] = storedHash.split(':');
      const hashBuffer = Buffer.from(originalHash, 'hex');
      const testBuffer = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
      return crypto.timingSafeEqual(hashBuffer, testBuffer);
    } catch {
      return false;
    }
  }

  /**
   * สร้าง JSON Web Token (HMAC-SHA256) พร้อมอายุใช้งาน
   */
  signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresInSeconds: number = 86400): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const body: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const base64Url = (obj: any) =>
      Buffer.from(JSON.stringify(obj))
        .toString('base64url');

    const encodedHeader = base64Url(header);
    const encodedBody = base64Url(body);
    const dataToSign = `${encodedHeader}.${encodedBody}`;

    const signature = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(dataToSign)
      .digest('base64url');

    return `${dataToSign}.${signature}`;
  }

  /**
   * ถอดรหัสและตรวจสอบลายเซ็นดิจิทัลของ JWT (Cryptographic Verification)
   */
  verifyJwt(token: string): JwtPayload {
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('กรุณาระบุ Authentication Token');
    }

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('รูปแบบ Token ไม่ถูกต้อง');
    }

    const [headerB64, bodyB64, signatureB64] = parts;
    const dataToVerify = `${headerB64}.${bodyB64}`;

    const expectedSignature = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(dataToVerify)
      .digest('base64url');

    try {
      const sigBuffer = Buffer.from(signatureB64, 'base64url');
      const expectedBuffer = Buffer.from(expectedSignature, 'base64url');

      if (
        sigBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
      ) {
        throw new UnauthorizedException('ลายเซ็น Token ไม่ถูกต้องหรือถูกดัดแปลง');
      }
    } catch (e: any) {
      throw new UnauthorizedException('การตรวจสอบลายเซ็น Token ล้มเหลว');
    }

    let payload: JwtPayload;
    try {
      payload = JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf8'));
    } catch {
      throw new UnauthorizedException('เนื้อหา Token เสียหาย');
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new UnauthorizedException('Session / Token หมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่');
    }

    return payload;
  }

  /**
   * เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน (Authentication)
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกระงับ');
    }

    const isValid = this.verifyPassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const token = this.signJwt({
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    return {
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  /**
   * ลงทะเบียนผู้ใช้งานใหม่ (User Registration)
   */
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานในระบบแล้ว');
    }

    const passwordHash = this.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        fullName: dto.fullName.trim(),
        role: dto.role || UserRole.ANNOTATOR,
        isActive: true,
      },
    });

    const token = this.signJwt({
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    return {
      success: true,
      message: 'ลงทะเบียนผู้ใช้สำเร็จ',
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  /**
   * ค้นหาข้อมูลโปรไฟล์ผู้ใช้งานปัจจุบัน
   */
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('ไม่พบบัญชีผู้ใช้งานในระบบ');
    }

    return { success: true, user };
  }
}
