import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReviewActionStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NEEDS_CORRECTION = 'NEEDS_CORRECTION',
}

export class SubmitReviewDto {
  @ApiProperty({
    enum: ReviewActionStatus,
    description: 'ผลการตรวจสอบรับรองข้อมูล',
    example: ReviewActionStatus.APPROVED,
  })
  @IsEnum(ReviewActionStatus)
  @IsNotEmpty()
  status: ReviewActionStatus;

  @ApiPropertyOptional({
    description: 'ข้อมูลที่มีการแก้ไข (JSON diff หรือ Structured Data ใหม่)',
    example: {
      skills: ['NestJS', 'PostgreSQL', 'FastAPI', 'Docker'],
      summary: 'Senior Backend Engineer with 6+ years experience',
    },
  })
  @IsOptional()
  corrections?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'บันทึกเพิ่มเติมจากผู้ตรวจสอบ',
    example: 'แก้ไขรายการทักษะที่ขาดไป และปรับปรุงวันที่เริ่มงานให้ตรงกับเอกสารต้นฉบับ',
  })
  @IsString()
  @IsOptional()
  reviewNotes?: string;

  @ApiPropertyOptional({
    description: 'รหัสผู้ตรวจสอบ (หากไม่มีจะใช้ระบบ System Annotator ชั่วคราว)',
    example: 'user-uuid-here',
  })
  @IsString()
  @IsOptional()
  reviewerId?: string;
}
