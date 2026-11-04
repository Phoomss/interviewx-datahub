import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { AuthService } from './auth.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('AuthService - Authentication, JWT & Password Hashing', () => {
  let service: AuthService;
  let mockPrisma: any;
  let mockConfig: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: mock(),
        create: mock(),
        count: mock().mockResolvedValue(1),
        upsert: mock(),
      },
    };

    mockConfig = {
      get: mock().mockImplementation((key: string, defaultVal: string) => {
        if (key === 'JWT_SECRET') return 'super_secret_test_jwt_key_32bytes_sample!';
        return defaultVal;
      }),
    };

    service = new AuthService(mockPrisma, mockConfig);
  });

  it('should hash password with PBKDF2 salt and verify successfully', () => {
    const password = 'SecurePassword2026!';
    const hashed = service.hashPassword(password);

    expect(hashed).toContain(':');
    expect(service.verifyPassword(password, hashed)).toBe(true);
    expect(service.verifyPassword('WrongPassword', hashed)).toBe(false);
  });

  it('should sign and cryptographically verify JWT token', () => {
    const payload = {
      sub: 'usr-12345',
      email: 'admin@interviewx.internal',
      role: UserRole.ADMIN,
      fullName: 'System Admin',
    };

    const token = service.signJwt(payload);
    expect(token.split('.').length).toBe(3);

    const verified = service.verifyJwt(token);
    expect(verified.sub).toBe('usr-12345');
    expect(verified.email).toBe('admin@interviewx.internal');
    expect(verified.role).toBe(UserRole.ADMIN);
  });

  it('should reject tampered JWT token', () => {
    const payload = {
      sub: 'usr-12345',
      email: 'user@interviewx.internal',
      role: UserRole.ANNOTATOR,
      fullName: 'Normal User',
    };

    const token = service.signJwt(payload);
    const parts = token.split('.');
    // Tamper with payload (elevate role to ADMIN)
    const tamperedPayload = Buffer.from(
      JSON.stringify({ ...payload, role: 'ADMIN' }),
    ).toString('base64url');
    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    expect(() => service.verifyJwt(tamperedToken)).toThrow(UnauthorizedException);
  });

  it('should authenticate user and return access token on valid credentials', async () => {
    const plainPassword = 'CorrectPassword123!';
    const passwordHash = service.hashPassword(plainPassword);

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-001',
      email: 'test@interviewx.internal',
      passwordHash,
      fullName: 'Test User',
      role: UserRole.ML_ENGINEER,
      isActive: true,
    });

    const res = await service.login({
      email: 'test@interviewx.internal',
      password: plainPassword,
    });

    expect(res.success).toBe(true);
    expect(res.accessToken).toBeDefined();
    expect(res.user.role).toBe(UserRole.ML_ENGINEER);
  });

  it('should throw UnauthorizedException on invalid password', async () => {
    const passwordHash = service.hashPassword('RealPassword');
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-001',
      email: 'test@interviewx.internal',
      passwordHash,
      fullName: 'Test User',
      role: UserRole.ANNOTATOR,
      isActive: true,
    });

    await expect(
      service.login({
        email: 'test@interviewx.internal',
        password: 'IncorrectPassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
