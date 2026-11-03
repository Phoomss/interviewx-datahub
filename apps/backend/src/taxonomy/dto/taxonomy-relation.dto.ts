import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LinkIndustryProfessionDto {
  @ApiProperty({ example: 'software_engineer', description: 'รหัสตำแหน่งงาน (Profession Key or UUID)' })
  @IsString()
  @IsNotEmpty()
  professionKey: string;

  @ApiProperty({ example: 'finance', description: 'รหัสกลุ่มอุตสาหกรรม (Industry Key or UUID)' })
  @IsString()
  @IsNotEmpty()
  industryKey: string;

  @ApiPropertyOptional({ example: false, description: 'เป็นอุตสาหกรรมหลักหรือไม่' })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class LinkProfessionSkillDto {
  @ApiProperty({ example: 'data_scientist', description: 'รหัสตำแหน่งงาน' })
  @IsString()
  @IsNotEmpty()
  professionKey: string;

  @ApiProperty({ example: 'Python', description: 'ชื่อหรือ ID ของทักษะ' })
  @IsString()
  @IsNotEmpty()
  skillIdentifier: string;

  @ApiPropertyOptional({ example: true, description: 'เป็นทักษะแกนหลักหรือไม่' })
  @IsOptional()
  @IsBoolean()
  isCore?: boolean;

  @ApiPropertyOptional({ example: 1.0, description: 'ค่าน้ำหนักความสำคัญ (0.1 - 1.0)' })
  @IsOptional()
  @IsNumber()
  relevance?: number;
}

export class LinkProfessionContextDto {
  @ApiProperty({ example: 'academic_researcher', description: 'รหัสตำแหน่งงาน' })
  @IsString()
  @IsNotEmpty()
  professionKey: string;

  @ApiProperty({ example: 'thesis_defense', description: 'รหัสบริบทการสัมภาษณ์' })
  @IsString()
  @IsNotEmpty()
  categoryKey: string;

  @ApiPropertyOptional({ example: 1.0, description: 'ค่าน้ำหนักความเกี่ยวข้อง' })
  @IsOptional()
  @IsNumber()
  relevance?: number;
}

export class LinkContextFormatDto {
  @ApiProperty({ example: 'thesis_defense', description: 'รหัสบริบทการสัมภาษณ์' })
  @IsString()
  @IsNotEmpty()
  categoryKey: string;

  @ApiProperty({ example: 'oral_defense', description: 'รหัสรูปแบบการสัมภาษณ์' })
  @IsString()
  @IsNotEmpty()
  formatKey: string;
}
