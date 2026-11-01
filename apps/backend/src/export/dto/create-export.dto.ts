import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, Min, Max, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExportDatasetFormat {
  ALPACA = 'ALPACA',
  SHAREGPT = 'SHAREGPT',
  CHATML = 'CHATML',
  EMBEDDING = 'EMBEDDING',
}

export class CreateExportDto {
  @ApiProperty({
    description: 'ชื่อชุดข้อมูลสำหรับอ้างอิงการเทรน',
    example: 'interviewx-backend-qa-v1',
  })
  @IsString()
  @IsNotEmpty()
  exportName: string;

  @ApiProperty({
    enum: ExportDatasetFormat,
    description: 'รูปแบบไฟล์ Dataset สำหรับ LLM Fine-tuning',
    example: ExportDatasetFormat.ALPACA,
  })
  @IsEnum(ExportDatasetFormat)
  @IsNotEmpty()
  format: ExportDatasetFormat;

  @ApiPropertyOptional({
    description: 'กรองเฉพาะตำแหน่งงานที่ต้องการ',
    example: ['Backend Engineer', 'Data Engineer'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @ApiPropertyOptional({
    description: 'ส่งออกเฉพาะ Synthetic Data (แนะนำสำหรับระยะแรก)',
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
    description: 'เกณฑ์ความมั่นใจขั้นต่ำของ AI Parser (0.0 - 1.0)',
    default: 0.85,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(1.0)
  minConfidence?: number = 0.85;
}
