import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInterviewCategoryDto {
  @ApiProperty({ example: 'clinical_board', description: 'รหัสประเภทการสัมภาษณ์' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Clinical Board Examination', description: 'ชื่อประเภทการสัมภาษณ์' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'การสอบสัมภาษณ์เพื่อรับรองบอร์ดการแพทย์', description: 'ชื่อภาษาไทย' })
  @IsOptional()
  @IsString()
  nameTh?: string;

  @ApiPropertyOptional({ example: 'Formal evaluation for specialty board licensing.', description: 'คำอธิบาย' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: [{ key: 'internal_medicine', name: 'Internal Medicine Board', nameTh: 'บอร์ดอายุรศาสตร์' }], description: 'หมวดหมู่ย่อย' })
  @IsArray()
  subcategories: any[];
}
