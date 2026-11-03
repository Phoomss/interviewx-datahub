import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReclassifyDocumentDto {
  @ApiProperty({
    description: 'หมวดหมู่เอกสารใหม่ที่ต้องการเปลี่ยน',
    example: 'ACADEMIC_CV',
  })
  @IsString()
  @IsNotEmpty()
  classification: string;

  @ApiPropertyOptional({
    description: 'ความเชื่อมั่นในการจัดหมวดหมู่ใหม่ (0.0 - 1.0)',
    example: 0.98,
    default: 1.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @ApiPropertyOptional({
    description: 'เหตุผลในการปรับแก้หมวดหมู่เอกสาร',
    example: 'Human verified: Contains peer-reviewed journal publications and academic grants.',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
