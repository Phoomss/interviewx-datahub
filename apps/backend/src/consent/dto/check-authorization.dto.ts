import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckAuthorizationDto {
  @ApiPropertyOptional({
    description: 'รหัสหนังสือยินยอม (Consent ID)',
    example: 'consent-demo-9841',
  })
  @IsOptional()
  @IsString()
  consentId?: string;

  @ApiPropertyOptional({
    description: 'รหัสเอกสาร (Document ID)',
    example: 'doc-real-001',
  })
  @IsOptional()
  @IsString()
  documentId?: string;

  @ApiPropertyOptional({
    description: 'รหัสเจ้าของข้อมูล (Subject ID)',
    example: 'SUBJ-2026-9841',
  })
  @IsOptional()
  @IsString()
  subjectId?: string;

  @ApiProperty({
    description: 'วัตถุประสงค์ในการประมวลผลที่ต้องการตรวจสอบ (Requested Purpose)',
    example: 'AI_MODEL_TRAINING',
  })
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiProperty({
    description: 'กิจกรรมการประมวลผล (Requested Activity เช่น PARSING, DEEP_EXTRACTION, DATASET_EXPORT)',
    example: 'DATASET_EXPORT',
  })
  @IsString()
  @IsNotEmpty()
  activity: string;

  @ApiPropertyOptional({
    description: 'หมวดหมู่เอกสาร/ข้อมูล (Data Category เช่น RESUME, TRANSCRIPT)',
    example: 'RESUME',
  })
  @IsOptional()
  @IsString()
  dataCategory?: string;
}
