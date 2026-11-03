import { IsNotEmpty, IsOptional, IsString, IsArray, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ConsentLegalBasis {
  CONSENT = 'CONSENT',
  CONTRACT = 'CONTRACT',
  LEGAL_OBLIGATION = 'LEGAL_OBLIGATION',
  VITAL_INTERESTS = 'VITAL_INTERESTS',
  PUBLIC_TASK = 'PUBLIC_TASK',
  LEGITIMATE_INTERESTS = 'LEGITIMATE_INTERESTS',
}

export enum ConsentStatusEnum {
  ACTIVE = 'ACTIVE',
  WITHDRAWN = 'WITHDRAWN',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

export const STANDARD_PURPOSES = [
  'DOCUMENT_EXTRACTION',
  'PROFILE_MANAGEMENT',
  'RESUME_ANALYSIS',
  'PORTFOLIO_ANALYSIS',
  'DATASET_PREPARATION',
  'AI_MODEL_TRAINING',
  'MODEL_FINE_TUNING',
  'AI_EVALUATION',
  'ACADEMIC_RESEARCH',
  'SYSTEM_IMPROVEMENT',
] as const;

export const STANDARD_DATA_CATEGORIES = [
  'RESUME',
  'CV',
  'ACADEMIC_CV',
  'PORTFOLIO',
  'TRANSCRIPT',
  'CERTIFICATE',
  'RECOMMENDATION_LETTER',
  'RESEARCH_PAPER',
  'PROJECT_REPORT',
  'EMPLOYMENT_DOCUMENT',
  'SCHOLARSHIP_DOCUMENT',
  'TRAINING_RECORD',
  'OTHER',
] as const;

export const STANDARD_PROCESSING_ACTIVITIES = [
  'PARSING',
  'OCR',
  'DEEP_EXTRACTION',
  'PII_VAULTING',
  'QUALITY_VALIDATION',
  'HUMAN_REVIEW',
  'DATASET_EXPORT',
  'ANONYMIZATION',
  'MODEL_FINE_TUNING',
  'AI_EVALUATION',
] as const;

export class CreateConsentDto {
  @ApiProperty({
    description: 'รหัสเจ้าของข้อมูล (Data Subject Identifier เช่น SUBJ-2026-9841 หรือ Applicant Code)',
    example: 'SUBJ-2026-9841',
  })
  @IsString()
  @IsNotEmpty()
  subjectIdentifier: string;

  @ApiProperty({
    description: 'ประเภทของความยินยอม',
    example: 'LLM_TRAINING_AND_EVALUATION',
  })
  @IsString()
  @IsNotEmpty()
  consentType: string;

  @ApiPropertyOptional({
    description: 'เวอร์ชันของความยินยอม (Consent Version)',
    example: '1.0',
    default: '1.0',
  })
  @IsOptional()
  @IsString()
  consentVersion?: string;

  @ApiPropertyOptional({
    description: 'ฐานความชอบด้วยกฎหมายในการประมวลผล (Legal Basis under PDPA/GDPR)',
    enum: ConsentLegalBasis,
    default: ConsentLegalBasis.CONSENT,
  })
  @IsOptional()
  @IsEnum(ConsentLegalBasis)
  legalBasis?: ConsentLegalBasis;

  @ApiPropertyOptional({
    description: 'วัตถุประสงค์ที่ได้รับอนุญาตให้ประมวลผล (Permitted Processing Purposes)',
    example: ['DOCUMENT_EXTRACTION', 'PROFILE_MANAGEMENT', 'AI_MODEL_TRAINING', 'AI_EVALUATION'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  permittedPurposes?: string[];

  @ApiPropertyOptional({
    description: 'หมวดหมู่เอกสาร/ข้อมูลที่ได้รับอนุญาต (Permitted Data Categories)',
    example: ['RESUME', 'CV', 'ACADEMIC_CV', 'PORTFOLIO', 'CERTIFICATE'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  permittedDataCategories?: string[];

  @ApiPropertyOptional({
    description: 'กิจกรรมการประมวลผลที่ได้รับอนุญาต (Permitted Processing Activities)',
    example: ['PARSING', 'OCR', 'DEEP_EXTRACTION', 'PII_VAULTING', 'DATASET_EXPORT'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  permittedProcessingActivities?: string[];

  @ApiPropertyOptional({
    description: 'URL ของเอกสารหนังสือยินยอมที่ลงนามแล้ว',
    example: 'https://minio.internal/consent-agreements/signed-9841.pdf',
  })
  @IsOptional()
  @IsString()
  agreementDocumentUrl?: string;

  @ApiPropertyOptional({
    description: 'เลขอ้างอิงหลักฐานการยินยอม (Evidence Reference Hash/ID)',
    example: 'EVID-SHA256-489bf2',
  })
  @IsOptional()
  @IsString()
  evidenceReference?: string;

  @ApiPropertyOptional({
    description: 'วิธีการเก็บรวบรวมความยินยอม',
    example: 'DIRECT_PORTAL',
  })
  @IsOptional()
  @IsString()
  collectionMethod?: string;

  @ApiPropertyOptional({
    description: 'วันหมดอายุของความยินยอม (ISO Date)',
    example: '2028-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
