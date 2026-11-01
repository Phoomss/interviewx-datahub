import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIndustryDto {
  @ApiProperty({ example: 'biotech', description: 'รหัสเอกลักษณ์ภาษาอังกฤษ (Unique Key)' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Biotechnology & Life Sciences', description: 'ชื่ออุตสาหกรรมภาษาอังกฤษ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'เทคโนโลยีชีวภาพและวิทยาศาสตร์สิ่งมีชีวิต', description: 'ชื่อภาษาไทย' })
  @IsOptional()
  @IsString()
  nameTh?: string;

  @ApiPropertyOptional({ example: 'Biopharmaceutical research and genomics.', description: 'คำอธิบาย' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Dna', description: 'ไอคอน' })
  @IsOptional()
  @IsString()
  icon?: string;
}
