import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRecordReviewDto {
  @ApiProperty({
    description: 'สถานะการตรวจรับรองคุณภาพ',
    example: 'VERIFIED',
    enum: ['VERIFIED', 'PENDING_REVIEW', 'NEEDS_REVISION', 'REJECTED'],
  })
  @IsString()
  @IsNotEmpty()
  qualityStatus: string;

  @ApiPropertyOptional({ description: 'บันทึกการตรวจสอบคุณภาพของผู้ตรวจ', example: 'ผ่านเกณฑ์โครงสร้างและไม่มี PII หลุดรอด' })
  @IsOptional()
  @IsString()
  reviewNotes?: string;
}
