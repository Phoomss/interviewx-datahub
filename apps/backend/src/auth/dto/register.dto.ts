import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@interviewx.internal', description: 'อีเมลผู้ใช้งาน' })
  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'รหัสผ่าน' })
  @IsString()
  @IsNotEmpty({ message: 'กรุณาระบุรหัสผ่าน' })
  @MinLength(8, { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' })
  password: string;

  @ApiProperty({ example: 'Somchai Prasert', description: 'ชื่อ-นามสกุล' })
  @IsString()
  @IsNotEmpty({ message: 'กรุณาระบุชื่อ-นามสกุล' })
  fullName: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.ANNOTATOR, description: 'บทบาทผู้ใช้' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
