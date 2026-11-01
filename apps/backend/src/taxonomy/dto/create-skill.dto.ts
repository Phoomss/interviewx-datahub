import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'technical', description: 'รหัสกลุ่มหมวดหมู่ทักษะ (SkillCategory Key or UUID)' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'Quantum Computing Algorithms', description: 'ชื่อทักษะ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'ขั้นตอนวิธีคำนวณเชิงควอนตัม', description: 'ชื่อทักษะภาษาไทย' })
  @IsOptional()
  @IsString()
  nameTh?: string;

  @ApiPropertyOptional({ example: 'Qiskit, Cirq and quantum gate logic.', description: 'คำอธิบาย' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['Beginner', 'Intermediate', 'Advanced'], description: 'ระดับความเชี่ยวชาญ' })
  @IsOptional()
  @IsArray()
  proficiencyLevels?: string[];
}
