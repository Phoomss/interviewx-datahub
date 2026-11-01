import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfessionDto {
  @ApiProperty({ example: 'tech', description: 'รหัสกลุ่มอุตสาหกรรม (Industry Key or Industry UUID)' })
  @IsString()
  @IsNotEmpty()
  industryId: string;

  @ApiProperty({ example: 'prompt_engineer', description: 'รหัสอาชีพภาษาอังกฤษ (Unique Key)' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Prompt Engineer', description: 'ชื่ออาชีพภาษาอังกฤษ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'วิศวกรคำสั่งพร้อมต์', description: 'ชื่อภาษาไทย' })
  @IsOptional()
  @IsString()
  nameTh?: string;

  @ApiPropertyOptional({ example: 'Crafts and optimizes prompts for generative LLMs.', description: 'คำอธิบาย' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['Few-shot Prompting', 'Chain-of-Thought', 'Evaluation'], description: 'ทักษะที่เกี่ยวข้อง' })
  @IsOptional()
  @IsArray()
  suggestedSkills?: string[];

  @ApiPropertyOptional({ example: { portfolioUrl: 'https://huggingface.co/portfolio' }, description: 'ฟิลด์เฉพาะสำหรับอาชีพนี้' })
  @IsOptional()
  professionSpecificFields?: Record<string, any>;
}
