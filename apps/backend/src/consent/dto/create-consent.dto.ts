import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConsentDto {
  @ApiProperty({
    description: 'รหัสหรือการอ้างอิงถึงเจ้าของข้อมูล (Data Subject Identifier เช่น CID หรือ Applicant Code)',
    example: 'SUBJ-2026-9841',
  })
  @IsString()
  @IsNotEmpty()
  subjectIdentifier: string;

  @ApiProperty({
    description: 'ประเภทของความยินยอม (Consent Type เช่น LLM_TRAINING_AND_EVALUATION)',
    example: 'LLM_TRAINING_AND_EVALUATION',
  })
  @IsString()
  @IsNotEmpty()
  consentType: string;

  @ApiPropertyOptional({
    description: 'URL หรือเอกสารหนังสือยินยอมที่ลงนามแล้ว (Signed Agreement URL)',
    example: 'https://minio.internal/consent-agreements/signed-9841.pdf',
  })
  @IsOptional()
  @IsString()
  agreementDocumentUrl?: string;
}
