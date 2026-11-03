import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterDocumentsDto {
  @ApiPropertyOptional({ description: 'ค้นหาด้วยคำสำคัญ (ชื่อไฟล์, ตำแหน่งงาน)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'กรองตามสถานะเอกสาร เช่น PARSED, APPROVED, IN_REVIEW' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'กรองตามหมวดหมู่เอกสาร เช่น RESUME, TRANSCRIPT, CERTIFICATE, ACADEMIC_CV' })
  @IsOptional()
  @IsString()
  classification?: string;

  @ApiPropertyOptional({ description: 'กรองตามสถานะ Training Eligibility เช่น APPROVED_FOR_TRAINING, AWAITING_REVIEW' })
  @IsOptional()
  @IsString()
  trainingEligibilityStatus?: string;

  @ApiPropertyOptional({ description: 'กรองเฉพาะ Synthetic Data หรือ Real Data' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isSynthetic?: boolean;

  @ApiPropertyOptional({ default: 1, description: 'หมายเลขหน้า' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, description: 'จำนวนรายการต่อหน้า' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
