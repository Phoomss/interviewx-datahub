import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadRealDocumentDto {
  @ApiProperty({
    description: 'ชื่อไฟล์เรซูเมต้นฉบับ',
    example: 'somchai_prasert_cv.pdf',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'รหัสหนังสือแสดงความยินยอม (Consent Record ID) *จำเป็นสำหรับข้อมูลจริง*',
    example: 'consent-uuid-1234',
  })
  @IsString()
  @IsNotEmpty()
  consentId: string;

  @ApiProperty({
    description: 'ข้อมูลส่วนบุคคล (PII) ที่ต้องแยกเก็บใน PiiVault อย่างปลอดภัย',
    example: {
      fullName: 'นาย สมชาย ประเสริฐ',
      email: 'somchai.p@example.com',
      phoneNumber: '+66891234567',
      address: 'Bangkok, Thailand',
      nationalId: '1-1004-99887-21-3',
    },
  })
  @IsObject()
  @IsNotEmpty()
  piiData: {
    fullName: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    nationalId?: string;
  };

  @ApiProperty({
    description: 'ข้อมูลทักษะและประวัติการทำงาน (Anonymized Structured Profile)',
    example: {
      professional_summary: 'Senior Fullstack Engineer with 8 years of React and NestJS experience.',
      skills: ['TypeScript', 'React', 'NestJS', 'PostgreSQL', 'Docker'],
      experiences: [
        {
          company_name: 'Leading Enterprise Co., Ltd.',
          role_title: 'Senior Fullstack Developer',
          start_date: '2020-02',
          end_date: 'Present',
          responsibilities: ['Developed cloud microservices architecture.'],
        },
      ],
      educations: [
        {
          institution: 'Kasetsart University',
          degree: 'B.Sc. Computer Science',
          graduation_year: 2016,
        },
      ],
    },
  })
  @IsObject()
  @IsNotEmpty()
  profileData: Record<string, any>;

  @ApiPropertyOptional({
    description: 'ข้อความดิบในเอกสาร (Raw Text)',
  })
  @IsOptional()
  @IsString()
  rawText?: string;
}
