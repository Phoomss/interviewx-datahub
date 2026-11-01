import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, Min, Max, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExportDatasetFormat {
  ALPACA = 'ALPACA',
  SHAREGPT = 'SHAREGPT',
  CHATML = 'CHATML',
  EMBEDDING = 'EMBEDDING',
  JSON = 'JSON',
  JSONL = 'JSONL',
  CSV = 'CSV',
  XLSX = 'XLSX',
}

export class CreateExportDto {
  @ApiProperty({
    description: 'ชื่อชุดข้อมูลสำหรับอ้างอิงการเทรน / ส่งออก',
    example: 'interviewx-universal-dataset-v1',
  })
  @IsString()
  @IsNotEmpty()
  exportName: string;

  @ApiProperty({
    enum: ExportDatasetFormat,
    description: 'รูปแบบไฟล์ Dataset สำหรับ LLM Fine-tuning หรือวิเคราะห์ข้อมูล',
    example: ExportDatasetFormat.JSON,
  })
  @IsEnum(ExportDatasetFormat)
  @IsNotEmpty()
  format: ExportDatasetFormat;

  @ApiPropertyOptional({
    description: 'ประเภทของชุดข้อมูล (profile, resume, interview_question, interview_answer, rubric_evaluation, feedback, scenario)',
    example: 'interview_question',
  })
  @IsOptional()
  @IsString()
  datasetType?: string;

  @ApiPropertyOptional({
    description: 'รหัสกลุ่มอุตสาหกรรม (Industry Key or ID)',
    example: 'healthcare',
  })
  @IsOptional()
  @IsString()
  industryKey?: string;

  @ApiPropertyOptional({
    description: 'กรองเฉพาะตำแหน่งงานที่ต้องการ',
    example: ['medical_doctor', 'nurse'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @ApiPropertyOptional({
    description: 'หมวดหมู่การสัมภาษณ์',
    example: 'job',
  })
  @IsOptional()
  @IsString()
  interviewCategory?: string;

  @ApiPropertyOptional({
    description: 'ระดับประสบการณ์',
    example: 'Senior',
  })
  @IsOptional()
  @IsString()
  seniority?: string;

  @ApiPropertyOptional({
    description: 'ส่งออกเฉพาะ Synthetic Data (แนะนำ)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isSyntheticOnly?: boolean = true;

  @ApiPropertyOptional({
    description: 'สัดส่วน Train Set (0.0 - 1.0)',
    default: 0.8,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(1.0)
  trainRatio?: number = 0.8;

  @ApiPropertyOptional({
    description: 'สัดส่วน Validation Set (0.0 - 1.0)',
    default: 0.1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.0)
  @Max(0.5)
  valRatio?: number = 0.1;

  @ApiPropertyOptional({
    description: 'เกณฑ์ความมั่นใจขั้นต่ำ (0.0 - 1.0)',
    default: 0.85,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(1.0)
  minConfidence?: number = 0.85;
}
